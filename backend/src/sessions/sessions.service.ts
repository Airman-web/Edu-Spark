import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import { CreateSessionDto } from './dto/create-session.dto';

const THIRTY_MINUTES = 30 * 60;

@Injectable()
export class SessionsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private mailService: MailService,
  ) {}

  async recordSession(studentId: string, dto: CreateSessionDto) {
    const student = await (this.prisma.student as any).findUnique({
      where: { student_id: studentId },
      include: { guardian: true },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const startedAt = new Date(Date.now() - dto.duration_seconds * 1000);

    const session = await (this.prisma.studentSession as any).create({
      data: {
        student_id: studentId,
        duration_seconds: dto.duration_seconds,
        started_at: startedAt,
      },
    });

    if (dto.duration_seconds < THIRTY_MINUTES) {
      const durationMinutes = Math.max(1, Math.floor(dto.duration_seconds / 60));

      // In-app notification for guardian
      await this.notificationsService.create({
        guardian_id: student.guardian_id,
        type: 'session_alert',
        title: `${student.full_name} left EduSpark early`,
        message: `${student.full_name} was only active for ${durationMinutes} minute${durationMinutes !== 1 ? 's' : ''} and is currently not learning. Consider encouraging them to continue.`,
      });

      // Email to guardian
      await this.mailService.sendGuardianSessionAlert(
        student.guardian.email,
        student.guardian.full_name,
        student.full_name,
        durationMinutes,
      );
    }

    return session;
  }

  async getTotalTime(studentId: string) {
    const student = await (this.prisma.student as any).findUnique({
      where: { student_id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const result = await (this.prisma.studentSession as any).aggregate({
      where: { student_id: studentId },
      _sum: { duration_seconds: true },
    });

    return {
      student_id: studentId,
      total_seconds: result._sum.duration_seconds ?? 0,
    };
  }

  async getChildTotalTime(guardianId: string, studentId: string) {
    const student = await (this.prisma.student as any).findUnique({
      where: { student_id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.guardian_id !== guardianId) {
      throw new ForbiddenException('This student does not belong to you');
    }

    const result = await (this.prisma.studentSession as any).aggregate({
      where: { student_id: studentId },
      _sum: { duration_seconds: true },
    });

    return {
      student_id: studentId,
      total_seconds: result._sum.duration_seconds ?? 0,
    };
  }
}
