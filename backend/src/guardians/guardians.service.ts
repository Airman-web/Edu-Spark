import { Injectable, ConflictException } from '@nestjs/common';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GuardiansService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createGuardianDto: CreateGuardianDto) {
    const { password, ...rest } = createGuardianDto;

    // Check if email already exists
    const existing = await (this.prisma.guardian as any).findUnique({
      where: { email: rest.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Check if phone number already exists
    const existingPhone = await (this.prisma.guardian as any).findFirst({
      where: { phone_number: rest.phone_number },
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const guardian = await (this.prisma.guardian as any).create({
      data: {
        ...rest,
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

    this.notificationsService.notifyAllAdmins({
      type: 'new_registration',
      title: 'New Guardian Registered',
      message: `A new guardian "${guardian.full_name}" (${guardian.email}) has created an account.`,
    }).catch(() => {});

    return guardian;
  }

  async findByEmail(email: string) {
    return (this.prisma.guardian as any).findUnique({
      where: { email },
    });
  }

  async findOne(id: string) {
    return (this.prisma.guardian as any).findUnique({
      where: { guardian_id: id },
      select: {
        guardian_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        created_at: true,
      },
    });
  }

  async getStudentPerformance(guardianId: string) {
    const students = await (this.prisma.student as any).findMany({
      where: { guardian_id: guardianId },
      include: {
        points_history: true,
      },
    });

    return students.map((student) => {
      const totalPoints = student.points_history.reduce(
        (sum, record) => sum + Number(record.points),
        0
      );
      
      const { password, points_history, ...studentData } = student;
      
      return {
        ...studentData,
        total_points: totalPoints,
      };
    });
  }
  async getStudentsCourseProgress(guardianId: string, coursesService: any) {
    const students = await (this.prisma.student as any).findMany({
      where: { guardian_id: guardianId },
      select: {
        student_id: true,
        full_name: true,
        display_name: true,
        profile_image_url: true,
      },
    });

    return Promise.all(
      students.map(async (student) => {
        const enrollments = await coursesService.getStudentEnrollments(student.student_id);
        
        return {
          ...student,
          name: student.display_name || student.full_name,
          enrollments,
        };
      })
    );
  }
}
