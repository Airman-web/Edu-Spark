import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  RegisterGuardianDto,
  RegisterStudentDto,
} from './dto/registration.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  async updateCourse(id: string, data: UpdateCourseDto) {
    try {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.grade_group_id !== undefined) {
        updateData.grade_group = { connect: { grade_group_id: data.grade_group_id } };
      }

      return await (this.prisma.course as any).update({
        where: { course_id: id },
        data: updateData,
        include: {
          grade_group: true,
          _count: {
            select: { lessons: true },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Course with ID "${id}" not found.`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            `A course with title "${data.title}" already exists for this grade group.`,
          );
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating the course.',
      );
    }
  }

  async deleteCourse(id: string) {
    try {
      await (this.prisma.course as any).delete({
        where: { course_id: id },
      });
      return { message: `Course "${id}" deleted successfully.` };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Course with ID "${id}" not found.`);
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting the course.',
      );
    }
  }

  async registerGuardian(data: RegisterGuardianDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      return await (this.prisma.guardian as any).create({
        data: {
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          password: hashedPassword,
        },
        select: {
          guardian_id: true,
          full_name: true,
          email: true,
          phone_number: true,
          created_at: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'A guardian with this email or phone number already exists.',
          );
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during guardian registration.',
      );
    }
  }

  async registerStudent(data: RegisterStudentDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      return await (this.prisma.student as any).create({
        data: {
          full_name: data.full_name,
          display_name: data.display_name,
          password: hashedPassword,
          guardian: {
            connect: { guardian_id: data.guardian_id },
          },
          grade_group: {
            connect: { grade_group_id: data.grade_group_id },
          },
        },
        include: {
          guardian: {
            select: { full_name: true, email: true },
          },
          grade_group: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'A student with this display name already exists.',
          );
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Guardian or Grade Group not found.');
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during student registration.',
      );
    }
  }

  async getAllLessons() {
    return (this.prisma.lesson as any).findMany({
      include: {
        course: {
          select: {
            title: true,
            description: true,
            course_id: true,
          }
        }
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  async getLessonById(id: string) {
    const lesson = await (this.prisma.lesson as any).findUnique({
      where: { lesson_id: id },
      include: {
        course: {
          select: {
            title: true,
            description: true,
            course_id: true,
          }
        }
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${id}" not found.`);
    }

    return lesson;
  }

  async getLessonsByCourse(courseId: string) {
    return (this.prisma.lesson as any).findMany({
      where: { course_id: courseId },
      include: {
        course: {
          select: {
            title: true,
            description: true,
            course_id: true,
          }
        }
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  async createLesson(data: CreateLessonDto) {
    try {
      return await (this.prisma.lesson as any).create({
        data: {
          title: data.title,
          content_type: data.content_type,
          content: data.content,
          points_reward: data.points_reward,
          course: {
            connect: { course_id: data.course_id },
          },
        },
        include: {
          course: {
            select: {
              title: true,
              description: true,
              course_id: true,
            }
          }
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `A lesson with title "${data.title}" already exists for this course.`,
          );
        }
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Course with ID "${data.course_id}" not found.`,
          );
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the lesson.',
      );
    }
  }

  async updateLesson(id: string, data: UpdateLessonDto) {
    try {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content_type !== undefined) updateData.content_type = data.content_type;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.points_reward !== undefined) updateData.points_reward = data.points_reward;
      if (data.course_id !== undefined) {
        updateData.course = { connect: { course_id: data.course_id } };
      }

      return await (this.prisma.lesson as any).update({
        where: { lesson_id: id },
        data: updateData,
        include: {
          course: {
            select: {
              title: true,
              description: true,
              course_id: true,
            }
          }
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Lesson with ID "${id}" or Course with ID "${data.course_id}" not found.`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            `A lesson with title "${data.title}" already exists for this course.`,
          );
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating the lesson.',
      );
    }
  }

  async deleteLesson(id: string) {
    try {
      await (this.prisma.lesson as any).delete({
        where: { lesson_id: id },
      });
      return { message: `Lesson "${id}" deleted successfully.` };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Lesson with ID "${id}" not found.`);
        }
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting the lesson.',
      );
    }
  }
}
