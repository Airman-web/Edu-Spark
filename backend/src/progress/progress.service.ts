import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import {
  UpdateLessonProgressDto,
  RecordQuizAttemptDto,
} from './dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
  ) {}

  async updateLessonProgress(studentId: string, dto: UpdateLessonProgressDto) {
    const { lesson_id, progress_percentage } = dto;

    // Check if student exists
    const student = await (this.prisma.student as any).findUnique({
      where: { student_id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const completed = progress_percentage >= 100;

    // Check if progress already exists
    const existing = await (
      this.prisma.studentLessonProgress as any
    ).findUnique({
      where: {
        student_id_lesson_id: { student_id: studentId, lesson_id },
      },
      include: { lesson: true },
    });

    let lastRewarded = 0;
    let lessonPoints = 0;
    let lessonTitle = '';

    if (existing) {
      lastRewarded = Number(existing.last_rewarded_percentage);
      lessonPoints = Number(existing.lesson.points_reward);
      lessonTitle = existing.lesson.title;

      // Calculate incremental points
      // Only award if current progress is greater than last rewarded
      const newProgress = Math.max(0, progress_percentage - lastRewarded);
      const pointsToAward = (newProgress / 100) * lessonPoints;

      const updated = await (this.prisma.studentLessonProgress as any).update({
        where: { progress_id: existing.progress_id },
        data: {
          progress_percentage,
          completed: completed || existing.completed,
          last_rewarded_percentage: Math.max(lastRewarded, progress_percentage),
          points: { increment: pointsToAward },
        },
      });

      if (pointsToAward > 0) {
        await this.pointsService.addPoints(
          studentId,
          pointsToAward,
          `Lesson Progress: ${lessonTitle} (${progress_percentage}%)`,
        );
      }

      return updated;
    }

    // New progress record
    const lesson = await (this.prisma.lesson as any).findUnique({
      where: { lesson_id },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const pointsToAward = (progress_percentage / 100) * Number(lesson.points_reward);

    const created = await (this.prisma.studentLessonProgress as any).create({
      data: {
        student_id: studentId,
        lesson_id,
        progress_percentage,
        completed,
        last_rewarded_percentage: progress_percentage,
        points: pointsToAward,
      },
    });

    if (pointsToAward > 0) {
      await this.pointsService.addPoints(
        studentId,
        pointsToAward,
        `Lesson Progress: ${lesson.title} (${progress_percentage}%)`,
      );
    }

    return created;
  }

  async recordQuizAttempt(studentId: string, dto: RecordQuizAttemptDto) {
    // Check if student exists
    const student = await (this.prisma.student as any).findUnique({
      where: { student_id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const attempt = await (this.prisma.studentQuizAttempt as any).create({
      data: {
        student_id: studentId,
        quiz_id: dto.quiz_id,
        score: dto.score,
      },
      include: { quiz: { include: { lesson: true } } },
    });

    // Award points based on quiz score
    await this.pointsService.addPoints(
      studentId,
      dto.score,
      `Quiz Result: ${attempt.quiz.lesson.title}`,
    );

    return attempt;
  }

  async getStudentProgress(studentId: string) {
    // Check if student exists
    const student = await (this.prisma.student as any).findUnique({
      where: { student_id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const [lessonProgress, quizAttempts, totalPoints] = await Promise.all([
      (this.prisma.studentLessonProgress as any).findMany({
        where: { student_id: studentId },
        include: { lesson: true },
      }),
      (this.prisma.studentQuizAttempt as any).findMany({
        where: { student_id: studentId },
        include: { quiz: { include: { lesson: true } } },
      }),
      this.pointsService.getTotalPoints(studentId),
    ]);

    return {
      completed_lessons: lessonProgress,
      quiz_attempts: quizAttempts,
      total_points: totalPoints,
    };
  }
}
