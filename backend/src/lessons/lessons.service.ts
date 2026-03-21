import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    try {
      const lesson = await (this.prisma.lesson as any).create({
        data: createLessonDto,
        include: {
          course: { select: { title: true, description: true, course_id: true } }
        }
      });

      this.notificationsService.notifyAllAdmins({
        type: 'new_lesson',
        title: 'New Lesson Added',
        message: `A new lesson "${lesson.title}" has been added to the course "${lesson.course.title}".`,
      }).catch(() => {});

      return lesson;
    } catch (error: any) {
      if (error && error.code === 'P2002') {
        throw new ConflictException('A lesson with this title already exists in the course.');
      }
      if (error && (error.code === 'P2025' || error.code === 'P2003')) {
        throw new NotFoundException('Course not found. Please provide a valid course_id.');
      }
      console.error('Lesson creation failed with unhandled error:', error);
      throw new InternalServerErrorException('An unexpected error occurred while creating the lesson.');
    }
  }

  findAll(courseId?: string) {
    if (courseId) {
      return (this.prisma.lesson as any).findMany({
        where: { course_id: courseId },
        include: { course: { select: { title: true, description: true, course_id: true } } },
      });
    }
    return (this.prisma.lesson as any).findMany({
      include: { course: { select: { title: true, description: true, course_id: true } } },
    });
  }

  findOne(id: string) {
    return (this.prisma.lesson as any).findUnique({
      where: { lesson_id: id },
      include: { quizzes: true, course: { select: { title: true, description: true, course_id: true } } },
    });
  }

  findLessonsByCourseId(courseId: string) {
    return (this.prisma.lesson as any).findMany({
      where: { course_id: courseId },
      include: { course: { select: { title: true, description: true, course_id: true } } },
    });
  }
}
