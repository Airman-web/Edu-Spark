import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { GuardiansService } from '../guardians/guardians.service';
import { StudentsService } from '../students/students.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: GuardiansService, useValue: mockGuardiansService },
        { provide: StudentsService, useValue: mockStudentsService },
        { provide: JwtService, useValue: mockJwtService },
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
    it('should successfully login a guardian and return a token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const guardian = {
        guardian_id: '1',
        email: 'test@example.com',
        password: 'hashed_password',
        full_name: 'Test Guardian',
      };

      mockGuardiansService.findByEmail.mockResolvedValue(guardian);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('test_token');

      const result = await service.login(loginDto);

      expect(result.access_token).toEqual('test_token');
      expect(result.user.email).toEqual('test@example.com');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };
      mockGuardiansService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
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
