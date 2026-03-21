import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './progress.service';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateLessonProgressDto } from './dto/progress.dto';

describe('ProgressService Incremental Progress', () => {
  let service: ProgressService;
  let prisma: PrismaService;
  let pointsService: PointsService;

  const mockStudentId = 'student-123';
  const mockLessonId = 'lesson-456';
  const mockLesson = {
    lesson_id: mockLessonId,
    title: 'Test Lesson',
    points_reward: 100,
  };

  const mockPrisma = {
    studentLessonProgress: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    lesson: {
      findUnique: jest.fn(),
    },
    student: {
      findUnique: jest.fn(),
    },
  };

  const mockPointsService = {
    addPoints: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PointsService, useValue: mockPointsService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    prisma = module.get<PrismaService>(PrismaService);
    pointsService = module.get<PointsService>(PointsService);
    jest.clearAllMocks();
  });

  it('should award initial points for new progress', async () => {
    const dto: UpdateLessonProgressDto = {
      lesson_id: mockLessonId,
      progress_percentage: 20,
    };

    mockPrisma.studentLessonProgress.findUnique.mockResolvedValue(null);
    mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
    mockPrisma.student.findUnique.mockResolvedValue({ student_id: mockStudentId });
    mockPrisma.studentLessonProgress.create.mockResolvedValue({ progress_id: 'p1' });

    await service.updateLessonProgress(mockStudentId, dto);
    
    expect(prisma.studentLessonProgress.create).toHaveBeenCalledWith({
      data: {
        student_id: mockStudentId,
        lesson_id: mockLessonId,
        progress_percentage: 20,
        completed: false,
        last_rewarded_percentage: 20,
        points: 20,
      },
    });

    // 20% of 100 points = 20 points
    expect(pointsService.addPoints).toHaveBeenCalledWith(
      mockStudentId,
      20,
      expect.stringContaining('20%'),
    );
  });

  it('should award incremental points for updated progress', async () => {
    const dto: UpdateLessonProgressDto = {
      lesson_id: mockLessonId,
      progress_percentage: 50,
    };

    const existingProgress = {
      progress_id: 'p1',
      last_rewarded_percentage: 20,
      lesson: mockLesson,
      completed: false
    };

    mockPrisma.studentLessonProgress.findUnique.mockResolvedValue(existingProgress);
    mockPrisma.student.findUnique.mockResolvedValue({ student_id: mockStudentId });
    mockPrisma.studentLessonProgress.update.mockResolvedValue({ progress_id: 'p1' });

    await service.updateLessonProgress(mockStudentId, dto);

    // Progress went from 20% to 50% = 30% increase
    // 30% of 100 points = 30 points
    expect(pointsService.addPoints).toHaveBeenCalledWith(
      mockStudentId,
      30,
      expect.stringContaining('50%'),
    );
  });

  it('should not award points if progress decreases or stays the same', async () => {
    const dto: UpdateLessonProgressDto = {
      lesson_id: mockLessonId,
      progress_percentage: 40, // Decrease from 50
    };

    const existingProgress = {
      progress_id: 'p1',
      last_rewarded_percentage: 50,
      lesson: mockLesson,
      completed: false
    };

    mockPrisma.studentLessonProgress.findUnique.mockResolvedValue(existingProgress);
    mockPrisma.student.findUnique.mockResolvedValue({ student_id: mockStudentId });
    mockPrisma.studentLessonProgress.update.mockResolvedValue({ progress_id: 'p1' });

    await service.updateLessonProgress(mockStudentId, dto);

    expect(pointsService.addPoints).not.toHaveBeenCalled();
  });

  it('should award exactly 100% of points when reaching 100% total', async () => {
      // First 50%
      mockPrisma.studentLessonProgress.findUnique.mockResolvedValue(null);
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.student.findUnique.mockResolvedValue({ student_id: mockStudentId });
      await service.updateLessonProgress(mockStudentId, { lesson_id: mockLessonId, progress_percentage: 50 });
      expect(pointsService.addPoints).toHaveBeenCalledWith(mockStudentId, 50, expect.any(String));

      jest.clearAllMocks();

      // Final 50%
      const existing = {
        progress_id: 'p1',
        last_rewarded_percentage: 50,
        lesson: mockLesson,
        completed: false
      };
      mockPrisma.studentLessonProgress.findUnique.mockResolvedValue(existing);
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson); // Inserted line
      mockPrisma.student.findUnique.mockResolvedValue({ student_id: mockStudentId });
      await service.updateLessonProgress(mockStudentId, { lesson_id: mockLessonId, progress_percentage: 100 });
      expect(pointsService.addPoints).toHaveBeenCalledWith(mockStudentId, 50, expect.any(String));
  });
});
