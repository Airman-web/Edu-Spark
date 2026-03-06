import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  create(createLessonDto: CreateLessonDto) {
    return (this.prisma.lesson as any).create({
      data: createLessonDto,
    });
  }

  findAll(courseId?: string) {
    if (courseId) {
      return (this.prisma.lesson as any).findMany({
        where: { course_id: courseId },
      });
    }
    return (this.prisma.lesson as any).findMany();
  }

  findOne(id: string) {
    return (this.prisma.lesson as any).findUnique({
      where: { lesson_id: id },
      include: { quizzes: true },
    });
  }
}
