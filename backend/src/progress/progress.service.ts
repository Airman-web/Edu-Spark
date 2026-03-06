import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { UpdateLessonProgressDto, RecordQuizAttemptDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
  ) {}

  async updateLessonProgress(studentId: string, dto: UpdateLessonProgressDto) {
    const { lesson_id, progress_percentage } = dto;
    const completed = progress_percentage >= 100;

    // Check if progress already exists
    const existing = await (this.prisma.studentLessonProgress as any).findUnique({
      where: {
        student_id_lesson_id: { student_id: studentId, lesson_id },
      },
    });

    if (existing) {
      const wasCompleted = existing.completed;
      const updated = await (this.prisma.studentLessonProgress as any).update({
        where: { progress_id: existing.progress_id },
        data: {
          progress_percentage,
          completed,
        },
      });

      // Award points if just completed
      if (!wasCompleted && completed) {
        const lesson = await (this.prisma.lesson as any).findUnique({ where: { lesson_id } });
        if (lesson) {
          await this.pointsService.addPoints(studentId, Number(lesson.points_reward), `Lesson Completion: ${lesson.title}`);
        }
      }
      return updated;
    }

    const created = await (this.prisma.studentLessonProgress as any).create({
      data: {
        student_id: studentId,
        lesson_id,
        progress_percentage,
        completed,
      },
    });

    if (completed) {
      const lesson = await (this.prisma.lesson as any).findUnique({ where: { lesson_id } });
      if (lesson) {
        await this.pointsService.addPoints(studentId, Number(lesson.points_reward), `Lesson Completion: ${lesson.title}`);
      }
    }

    return created;
  }

  async recordQuizAttempt(studentId: string, dto: RecordQuizAttemptDto) {
    const attempt = await (this.prisma.studentQuizAttempt as any).create({
      data: {
        student_id: studentId,
        quiz_id: dto.quiz_id,
        score: dto.score,
      },
      include: { quiz: { include: { lesson: true } } },
    });

    // Award points based on quiz score
    await this.pointsService.addPoints(studentId, dto.score, `Quiz Result: ${attempt.quiz.lesson.title}`);

    return attempt;
  }

  async getStudentProgress(studentId: string) {
    return (this.prisma.studentLessonProgress as any).findMany({
      where: { student_id: studentId },
      include: { lesson: true },
    });
  }
}
