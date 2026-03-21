import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(guardianId: string, createStudentDto: CreateStudentDto) {
    try {
      // Check if display_name already exists
      const existing = await (this.prisma.student as any).findFirst({
        where: {
          display_name: createStudentDto.display_name,
        },
      });

      if (existing) {
        throw new ConflictException('Display Name already taken');
      }

      // Check if grade group exists
      const gradeGroup = await (this.prisma.gradeGroup as any).findUnique({
        where: { grade_group_id: createStudentDto.grade_group_id },
      });

      if (!gradeGroup) {
        throw new ConflictException('Grade Group not found');
      }

      const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

      // Handle date conversion if present
      const dateOfBirth = createStudentDto.date_of_birth
        ? new Date(createStudentDto.date_of_birth)
        : null;

      const student = await (this.prisma.student as any).create({
        data: {
          ...createStudentDto,
          date_of_birth: dateOfBirth,
          password: hashedPassword,
          guardian_id: guardianId,
        },
        include: {
          grade_group: true,
        },
      });

      this.notificationsService.notifyAllAdmins({
        type: 'new_registration',
        title: 'New Student Registered',
        message: `A new student "${student.full_name}" (@${student.display_name}) has been registered in ${student.grade_group.name}.`,
      }).catch(() => {});

      return student;
    } catch (error) {
      console.error('Error creating student:', error);
      if (
        error instanceof ConflictException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw error; // Let Nest handle generic 500 or refine based on code
    }
  }

  async findByDisplayName(displayName: string) {
    return (this.prisma.student as any).findUnique({
      where: { display_name: displayName },
      include: {
        grade_group: true,
      },
    });
  }

  async findAllByGuardian(guardianId: string) {
    return (this.prisma.student as any).findMany({
      where: { guardian_id: guardianId },
      include: {
        grade_group: true,
      },
    });
  }

  async findOneForGuardian(studentId: string, guardianId: string) {
    const student = await (this.prisma.student as any).findUnique({
      where: { student_id: studentId },
    });

    if (!student) return null;
    if (student.guardian_id !== guardianId) {
      throw new ForbiddenException(
        'You do not have access to this student profile',
      );
    }

    return student;
  }

  async updateForGuardian(
    studentId: string,
    guardianId: string,
    updateStudentDto: UpdateStudentDto,
  ) {
    const student = await (this.prisma.student as any).findUnique({
      where: { student_id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.guardian_id !== guardianId) {
      throw new ForbiddenException(
        'You do not have access to update this student profile',
      );
    }

    if (
      updateStudentDto.display_name &&
      updateStudentDto.display_name !== student.display_name
    ) {
      const existing = await (this.prisma.student as any).findFirst({
        where: { display_name: updateStudentDto.display_name },
      });
      if (existing) {
        throw new ConflictException('Display Name already taken');
      }
    }

    if (updateStudentDto.grade_group_id) {
      const gradeGroup = await (this.prisma.gradeGroup as any).findUnique({
        where: { grade_group_id: updateStudentDto.grade_group_id },
      });
      if (!gradeGroup) {
        throw new NotFoundException('Grade Group not found');
      }
    }

    const updateData: any = { ...updateStudentDto };

    if (updateStudentDto.password) {
      updateData.password = await bcrypt.hash(updateStudentDto.password, 10);
    }

    if (updateStudentDto.date_of_birth) {
      updateData.date_of_birth = new Date(updateStudentDto.date_of_birth);
    }

    return await (this.prisma.student as any).update({
      where: { student_id: studentId },
      data: updateData,
      include: {
        grade_group: true,
      },
    });
  }
}
