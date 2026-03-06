import { Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(guardianId: string, createStudentDto: CreateStudentDto) {
    // Check if display_name already exists
    const existing = await (this.prisma.student as any).findFirst({
      where: {
        display_name: createStudentDto.display_name,
      },
    });

    if (existing) {
      throw new ConflictException('Student ID or Display Name already taken');
    }

    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    return (this.prisma.student as any).create({
      data: {
        ...createStudentDto,
        password: hashedPassword,
        guardian_id: guardianId,
      },
      include: {
        grade_group: true,
      },
    });
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
      throw new ForbiddenException('You do not have access to this student profile');
    }

    return student;
  }
}
