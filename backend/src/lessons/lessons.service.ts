import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  create(createLessonDto: CreateLessonDto) {
    return (this.prisma.lesson as any).create({
      data: createLessonDto,
      include: {
        course: { select: { title: true, description: true, course_id: true } }
      }
    });
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
