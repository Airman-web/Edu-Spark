import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = await this.prisma.course.create({
      data: createCourseDto,
    });

    this.notificationsService.notifyAllAdmins({
      type: 'new_course',
      title: 'New Course Created',
      message: `A new course "${course.title}" has been created.`,
    }).catch(() => {});

    return course;
  }

  findAll(gradeGroupId?: string) {
    return this.prisma.course.findMany({
      where: gradeGroupId ? { grade_group_id: gradeGroupId } : undefined,
      include: {
        grade_group: true,
        _count: {
          select: { lessons: true },
        },
      },
      orderBy: { title: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { course_id: id },
      include: {
        grade_group: true,
        _count: {
          select: { lessons: true },
        },
      },
    });
  }

  async enroll(courseId: string, studentId: string) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: {
        student_id_course_id: {
          student_id: studentId,
          course_id: courseId,
        },
      },
    });
    if (existing) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    const enrollment = await this.prisma.enrollment.create({
      data: {
        student_id: studentId,
        course_id: courseId,
      },
      include: {
        course: {
          include: {
            grade_group: true,
            _count: { select: { lessons: true } },
          },
        },
      },
    });

    await this.notificationsService.create({
      student_id: studentId,
      type: 'enrollment',
      title: 'Enrolled in a New Course!',
      message: `You've been enrolled in "${course.title}". Start learning and earn points!`,
    });

    return enrollment;
  }

  async getStudentEnrollments(studentId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { student_id: studentId },
      include: {
        course: {
          include: {
            grade_group: true,
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { enrolled_at: 'desc' },
    });

    return Promise.all(
      enrollments.map(async (enrollment) => {
        const courseId = enrollment.course_id;

        // Count completed lessons for this specific course
        const completedLessonsCount = await this.prisma.studentLessonProgress.count({
          where: {
            student_id: studentId,
            completed: true,
            lesson: { course_id: courseId },
          },
        });

        const totalLessons = enrollment.course._count.lessons;
        const progressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

        // Get quiz attempts count for quizzes attached to lessons strictly within this course
        const quizAttemptsCount = await this.prisma.studentQuizAttempt.count({
          where: {
            student_id: studentId,
            quiz: { lesson: { course_id: courseId } },
          },
        });

        // Determine last activity: Latest lesson progress updated_at, or quiz attempt completed_at, fallback to enrolled_at
        const lastLessonProgress = await this.prisma.studentLessonProgress.findFirst({
          where: { student_id: studentId, lesson: { course_id: courseId } },
          orderBy: { updated_at: 'desc' },
          select: { updated_at: true },
        });

        const lastQuizAttempt = await this.prisma.studentQuizAttempt.findFirst({
          where: { student_id: studentId, quiz: { lesson: { course_id: courseId } } },
          orderBy: { completed_at: 'desc' },
          select: { completed_at: true },
        });

        const activityDates = [
          enrollment.enrolled_at,
          lastLessonProgress?.updated_at,
          lastQuizAttempt?.completed_at,
        ].filter(Boolean) as Date[];

        const lastActivity = new Date(Math.max(...activityDates.map((d) => d.getTime())));

        return {
          ...enrollment,
          course: {
            ...enrollment.course,
            total_lessons: totalLessons,
            completed_lessons: completedLessonsCount,
            progress_percentage: Math.round(progressPercentage * 100) / 100, // Round to 2 decimals
            quiz_attempts_count: quizAttemptsCount,
            last_activity: lastActivity,
          },
        };
      })
    );
  }
}
