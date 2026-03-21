import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { GuardiansService } from '../guardians/guardians.service';
import { StudentsService } from '../students/students.service';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let guardiansService: GuardiansService;
  let studentsService: StudentsService;
  let jwtService: JwtService;

  const mockGuardiansService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockStudentsService = {
    findByDisplayName: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockPrismaService = {
    systemAdmin: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: GuardiansService, useValue: mockGuardiansService },
        { provide: StudentsService, useValue: mockStudentsService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    guardiansService = module.get<GuardiansService>(GuardiansService);
    studentsService = module.get<StudentsService>(StudentsService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should successfully sign up a guardian and return a token', async () => {
      const createGuardianDto = {
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test Guardian',
        phone_number: '1234567890',
      };
      const guardian = { guardian_id: '1', ...createGuardianDto };
      mockGuardiansService.create.mockResolvedValue(guardian);
      mockJwtService.signAsync.mockResolvedValue('test_token');

      const result = await service.signup(createGuardianDto);

      expect(result).toEqual({
        access_token: 'test_token',
        user: {
          id: '1',
          full_name: 'Test Guardian',
          email: 'test@example.com',
          role: 'guardian',
        },
      });
      expect(mockGuardiansService.create).toHaveBeenCalledWith(
        createGuardianDto,
      );
    });
  });

  describe('login', () => {
    it('should successfully login an admin and return a token', async () => {
      const loginDto = { email: 'admin@example.com', password: 'password123' };
      const admin = {
        admin_id: 'a1',
        email: 'admin@example.com',
        password: 'hashed_password',
        full_name: 'Test Admin',
      };

      mockPrismaService.systemAdmin.findUnique.mockResolvedValue(admin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('test_admin_token');

      const result = await service.login(loginDto);

      expect(result.access_token).toEqual('test_admin_token');
      expect(result.user.role).toEqual('admin');
    });

    it('should successfully login a guardian and return a token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const guardian = {
        guardian_id: '1',
        email: 'test@example.com',
        password: 'hashed_password',
        full_name: 'Test Guardian',
      };

      mockPrismaService.systemAdmin.findUnique.mockResolvedValue(null);
      mockGuardiansService.findByEmail.mockResolvedValue(guardian);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('test_token');

      const result = await service.login(loginDto);

      expect(result.access_token).toEqual('test_token');
      expect(result.user.email).toEqual('test@example.com');
      expect(result.user.role).toEqual('guardian');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };
      mockPrismaService.systemAdmin.findUnique.mockResolvedValue(null);
      mockGuardiansService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('switchToChild', () => {
    const mockStudent = {
      student_id: 's1',
      guardian_id: 'guardian-1',
      display_name: 'child1',
      full_name: 'Child One',
    };

    it('should throw UnauthorizedException if student is not found', async () => {
      mockPrismaService.systemAdmin.findUnique.mockResolvedValue(null);
      (mockPrismaService as any).student = { findUnique: jest.fn().mockResolvedValue(null) };

      await expect(
        service.switchToChild('guardian-1', 'bad-student'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if student belongs to different guardian', async () => {
      (mockPrismaService as any).student = {
        findUnique: jest.fn().mockResolvedValue({ ...mockStudent, guardian_id: 'other-guardian' }),
      };

      await expect(
        service.switchToChild('guardian-1', 's1'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return a student-scoped token when guardian owns the student', async () => {
      (mockPrismaService as any).student = {
        findUnique: jest.fn().mockResolvedValue(mockStudent),
      };
      mockJwtService.signAsync.mockResolvedValue('child_token');

      const result = await service.switchToChild('guardian-1', 's1');

      expect(result.access_token).toBe('child_token');
      expect(result.user.role).toBe('student');
      expect(result.user.display_name).toBe('child1');
    });
  });

  describe('studentLogin', () => {
    it('should successfully login a student and return a token', async () => {
      const studentLoginDto = {
        display_name: 'student1',
        password: 'password123',
      };
      const student = {
        student_id: 's1',
        display_name: 'student1',
        password: 'hashed_password',
        full_name: 'Test Student',
      };

      mockStudentsService.findByDisplayName.mockResolvedValue(student);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('test_student_token');

      const result = await service.studentLogin(studentLoginDto);

      expect(result.access_token).toEqual('test_student_token');
      expect(result.user.display_name).toEqual('student1');
    });

    it('should throw UnauthorizedException for invalid student credentials', async () => {
      const studentLoginDto = { display_name: 'unknown', password: 'any' };
      mockStudentsService.findByDisplayName.mockResolvedValue(null);

      await expect(service.studentLogin(studentLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
