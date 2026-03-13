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
    const query = {
      include: {
        grade_group: true,
        _count: {
          select: { lessons: true },
        },
      },
      orderBy: { title: 'asc' },
    };

    if (gradeGroupId) {
      return (this.prisma.course as any).findMany({
        ...query,
        where: { grade_group_id: gradeGroupId },
      });
    }
    return (this.prisma.course as any).findMany(query);
  }

  findOne(id: string) {
    return (this.prisma.course as any).findUnique({
      where: { course_id: id },
      include: {
        grade_group: true,
        _count: {
          select: { lessons: true },
        },
      },
    });
  }
}
