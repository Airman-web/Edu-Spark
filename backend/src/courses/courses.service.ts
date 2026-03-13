import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  create(createCourseDto: CreateCourseDto) {
    return this.prisma.course.create({
      data: createCourseDto,
    });
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

    return this.prisma.enrollment.create({
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
  }

  getStudentEnrollments(studentId: string) {
    return this.prisma.enrollment.findMany({
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
  }
}
