import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  private whereClause(userId: string, role: string) {
    if (role === 'student') return { student_id: userId };
    if (role === 'guardian') return { guardian_id: userId };
    return { admin_id: userId };
  }

  async create(data: {
    student_id?: string;
    guardian_id?: string;
    admin_id?: string;
    type: string;
    title: string;
    message: string;
  }) {
    return (this.prisma.notification as any).create({ data });
  }

  async notifyAllAdmins(data: { type: string; title: string; message: string }) {
    const admins = await (this.prisma.systemAdmin as any).findMany({
      select: { admin_id: true },
    });

    await Promise.all(
      admins.map((admin) =>
        (this.prisma.notification as any).create({
          data: { admin_id: admin.admin_id, ...data },
        }),
      ),
    );
  }

  async getForUser(userId: string, role: string) {
    return (this.prisma.notification as any).findMany({
      where: this.whereClause(userId, role),
      orderBy: { created_at: 'desc' },
    });
  }

  async getUnreadCount(userId: string, role: string) {
    const count = await (this.prisma.notification as any).count({
      where: { ...this.whereClause(userId, role), is_read: false },
    });
    return { unread_count: count };
  }

  async markAsRead(notificationId: string, userId: string, role: string) {
    const notification = await (this.prisma.notification as any).findUnique({
      where: { notification_id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const ownerId =
      role === 'student'
        ? notification.student_id
        : role === 'guardian'
          ? notification.guardian_id
          : notification.admin_id;

    if (ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return (this.prisma.notification as any).update({
      where: { notification_id: notificationId },
      data: { is_read: true },
    });
  }

  async markAllAsRead(userId: string, role: string) {
    return (this.prisma.notification as any).updateMany({
      where: { ...this.whereClause(userId, role), is_read: false },
      data: { is_read: true },
    });
  }
}
