import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalStudents = await (this.prisma.student as any).count();
    const totalGuardians = await (this.prisma.guardian as any).count();
    const totalCourses = await (this.prisma.course as any).count();

    // For now, active students can be those who have some lesson progress
    const activeStudents = await (this.prisma.student as any).count({
      where: {
        lesson_progress: {
          some: {},
        },
      },
    });

    return {
      totalStudents,
      totalGuardians,
      totalCourses,
      activeStudents,
    };
  }

  async getAllStudents() {
    return (this.prisma.student as any).findMany({
      include: {
        grade_group: true,
        guardian: {
          select: {
            full_name: true,
            email: true,
          },
        },
      },
      orderBy: {
        full_name: 'asc',
      },
    });
  }

  async getAllGuardians() {
    return (this.prisma.guardian as any).findMany({
      select: {
        guardian_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        created_at: true,
        _count: {
          select: { students: true },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getAllCourses() {
    return (this.prisma.course as any).findMany({
      include: {
        grade_group: true,
        _count: {
          select: { lessons: true },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  async getRecentGuardians(limit = 10) {
    return (this.prisma.guardian as any).findMany({
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        guardian_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        created_at: true,
      },
    });
  }

  async createCourse(data: CreateCourseDto) {
    try {
      return await (this.prisma.course as any).create({
        data: {
          title: data.title,
          description: data.description,
          grade_group: {
            connect: { grade_group_id: data.grade_group_id },
          },
        },
        include: {
          grade_group: true,
          _count: {
            select: { lessons: true },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed (Duplicate title for same grade group)
        if (error.code === 'P2002') {
          throw new ConflictException(
            `A course with title "${data.title}" already exists for this grade group.`,
          );
        }
        // P2025: Foreign key constraint failed (Grade group not found)
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Grade group with ID "${data.grade_group_id}" not found.`,
          );
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the course.',
      );
    }
  }
}
