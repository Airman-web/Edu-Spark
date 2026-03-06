import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  create(createCourseDto: CreateCourseDto) {
    return (this.prisma.course as any).create({
      data: createCourseDto,
    });
  }

  findAll(gradeGroupId?: string) {
    if (gradeGroupId) {
      return (this.prisma.course as any).findMany({
        where: { grade_group_id: gradeGroupId },
        include: { lessons: true },
      });
    }
    return (this.prisma.course as any).findMany({
      include: { lessons: true },
    });
  }

  findOne(id: string) {
    return (this.prisma.course as any).findUnique({
      where: { course_id: id },
      include: { lessons: true },
    });
  }
}
