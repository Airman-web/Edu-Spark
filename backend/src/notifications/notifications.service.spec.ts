import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockPrisma = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    systemAdmin: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const data = {
        student_id: 'student-1',
        type: 'points_earned',
        title: 'Points Earned!',
        message: 'You earned 50 points',
      };
      mockPrisma.notification.create.mockResolvedValue({ notification_id: 'n1', ...data });

      const result = await service.create(data);

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({ data });
      expect(result.notification_id).toBe('n1');
    });
  });

  describe('getForUser', () => {
    it('should query by student_id for student role', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);

      await service.getForUser('student-1', 'student');

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { student_id: 'student-1' } }),
      );
    });

    it('should query by guardian_id for guardian role', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);

      await service.getForUser('guardian-1', 'guardian');

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { guardian_id: 'guardian-1' } }),
      );
    });

    it('should query by admin_id for admin role', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);

      await service.getForUser('admin-1', 'admin');

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { admin_id: 'admin-1' } }),
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for a student', async () => {
      mockPrisma.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('student-1', 'student');

      expect(result).toEqual({ unread_count: 5 });
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { student_id: 'student-1', is_read: false },
      });
    });

    it('should return unread count for a guardian', async () => {
      mockPrisma.notification.count.mockResolvedValue(3);

      const result = await service.getUnreadCount('guardian-1', 'guardian');

      expect(result).toEqual({ unread_count: 3 });
    });
  });

  describe('markAsRead', () => {
    it('should throw NotFoundException if notification does not exist', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);

      await expect(
        service.markAsRead('bad-id', 'student-1', 'student'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if student does not own the notification', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({
        notification_id: 'n1',
        student_id: 'other-student',
      });

      await expect(
        service.markAsRead('n1', 'student-1', 'student'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if guardian does not own the notification', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({
        notification_id: 'n1',
        guardian_id: 'other-guardian',
      });

      await expect(
        service.markAsRead('n1', 'guardian-1', 'guardian'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should mark notification as read for the correct student', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({
        notification_id: 'n1',
        student_id: 'student-1',
      });
      mockPrisma.notification.update.mockResolvedValue({ notification_id: 'n1', is_read: true });

      const result = await service.markAsRead('n1', 'student-1', 'student');

      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { notification_id: 'n1' },
        data: { is_read: true },
      });
      expect(result.is_read).toBe(true);
    });

    it('should mark notification as read for the correct admin', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({
        notification_id: 'n1',
        admin_id: 'admin-1',
      });
      mockPrisma.notification.update.mockResolvedValue({ notification_id: 'n1', is_read: true });

      await service.markAsRead('n1', 'admin-1', 'admin');

      expect(mockPrisma.notification.update).toHaveBeenCalled();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read for student', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 4 });

      await service.markAllAsRead('student-1', 'student');

      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: { student_id: 'student-1', is_read: false },
        data: { is_read: true },
      });
    });

    it('should mark all unread notifications as read for guardian', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 2 });

      await service.markAllAsRead('guardian-1', 'guardian');

      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: { guardian_id: 'guardian-1', is_read: false },
        data: { is_read: true },
      });
    });
  });

  describe('notifyAllAdmins', () => {
    it('should create a notification for each admin', async () => {
      mockPrisma.systemAdmin.findMany.mockResolvedValue([
        { admin_id: 'admin-1' },
        { admin_id: 'admin-2' },
      ]);
      mockPrisma.notification.create.mockResolvedValue({});

      await service.notifyAllAdmins({
        type: 'new_course',
        title: 'New Course',
        message: 'A new course was created',
      });

      expect(mockPrisma.notification.create).toHaveBeenCalledTimes(2);
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: { admin_id: 'admin-1', type: 'new_course', title: 'New Course', message: 'A new course was created' },
      });
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: { admin_id: 'admin-2', type: 'new_course', title: 'New Course', message: 'A new course was created' },
      });
    });

    it('should do nothing when there are no admins', async () => {
      mockPrisma.systemAdmin.findMany.mockResolvedValue([]);

      await service.notifyAllAdmins({ type: 'x', title: 'x', message: 'x' });

      expect(mockPrisma.notification.create).not.toHaveBeenCalled();
    });
  });
});
