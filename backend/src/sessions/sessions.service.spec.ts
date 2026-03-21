import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('SessionsService', () => {
  let service: SessionsService;

  const mockStudent = {
    student_id: 'student-1',
    full_name: 'John Doe',
    guardian_id: 'guardian-1',
    guardian: {
      guardian_id: 'guardian-1',
      full_name: 'Jane Doe',
      email: 'jane@example.com',
    },
  };

  const mockPrisma = {
    student: { findUnique: jest.fn() },
    studentSession: { create: jest.fn(), aggregate: jest.fn() },
  };

  const mockNotificationsService = {
    create: jest.fn(),
  };

  const mockMailService = {
    sendGuardianSessionAlert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordSession', () => {
    it('should throw NotFoundException if student does not exist', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(null);

      await expect(
        service.recordSession('bad-id', { duration_seconds: 100 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should record the session and return it', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(mockStudent);
      mockPrisma.studentSession.create.mockResolvedValue({ session_id: 's1', duration_seconds: 2000 });
      mockNotificationsService.create.mockResolvedValue({});
      mockMailService.sendGuardianSessionAlert.mockResolvedValue(undefined);

      const result = await service.recordSession('student-1', { duration_seconds: 2000 });

      expect(result).toEqual({ session_id: 's1', duration_seconds: 2000 });
      expect(mockPrisma.studentSession.create).toHaveBeenCalledWith({
        data: {
          student_id: 'student-1',
          duration_seconds: 2000,
          started_at: expect.any(Date),
        },
      });
    });

    it('should send email and notification when session < 30 minutes', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(mockStudent);
      mockPrisma.studentSession.create.mockResolvedValue({ session_id: 's1' });
      mockNotificationsService.create.mockResolvedValue({});
      mockMailService.sendGuardianSessionAlert.mockResolvedValue(undefined);

      await service.recordSession('student-1', { duration_seconds: 600 }); // 10 min

      expect(mockNotificationsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          guardian_id: 'guardian-1',
          type: 'session_alert',
        }),
      );
      expect(mockMailService.sendGuardianSessionAlert).toHaveBeenCalledWith(
        'jane@example.com',
        'Jane Doe',
        'John Doe',
        10,
      );
    });

    it('should NOT send email or notification when session >= 30 minutes', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(mockStudent);
      mockPrisma.studentSession.create.mockResolvedValue({ session_id: 's1' });

      await service.recordSession('student-1', { duration_seconds: 1800 }); // exactly 30 min

      expect(mockNotificationsService.create).not.toHaveBeenCalled();
      expect(mockMailService.sendGuardianSessionAlert).not.toHaveBeenCalled();
    });
  });

  describe('getTotalTime', () => {
    it('should throw NotFoundException if student does not exist', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(null);

      await expect(service.getTotalTime('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('should return total seconds for a student', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(mockStudent);
      mockPrisma.studentSession.aggregate.mockResolvedValue({ _sum: { duration_seconds: 3600 } });

      const result = await service.getTotalTime('student-1');

      expect(result).toEqual({ student_id: 'student-1', total_seconds: 3600 });
    });

    it('should return 0 when student has no sessions', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(mockStudent);
      mockPrisma.studentSession.aggregate.mockResolvedValue({ _sum: { duration_seconds: null } });

      const result = await service.getTotalTime('student-1');

      expect(result.total_seconds).toBe(0);
    });
  });

  describe('getChildTotalTime', () => {
    it('should throw NotFoundException if student does not exist', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(null);

      await expect(
        service.getChildTotalTime('guardian-1', 'bad-student'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if student belongs to different guardian', async () => {
      mockPrisma.student.findUnique.mockResolvedValue({
        ...mockStudent,
        guardian_id: 'other-guardian',
      });

      await expect(
        service.getChildTotalTime('guardian-1', 'student-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return total time for guardian\'s child', async () => {
      mockPrisma.student.findUnique.mockResolvedValue(mockStudent);
      mockPrisma.studentSession.aggregate.mockResolvedValue({ _sum: { duration_seconds: 7200 } });

      const result = await service.getChildTotalTime('guardian-1', 'student-1');

      expect(result).toEqual({ student_id: 'student-1', total_seconds: 7200 });
    });
  });
});
