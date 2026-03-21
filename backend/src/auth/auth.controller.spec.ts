import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
    studentLogin: jest.fn(),
    switchToChild: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup', async () => {
      const dto = { email: 'test@example.com', password: 'password', full_name: 'Test', phone_number: '1234567890' };
      mockAuthService.signup.mockResolvedValue({ access_token: 'token' });
      const result = await controller.signup(dto);
      expect(result).toEqual({ access_token: 'token' });
      expect(service.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      mockAuthService.login.mockResolvedValue({ access_token: 'token' });
      const result = await controller.login(dto);
      expect(result).toEqual({ access_token: 'token' });
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('studentLogin', () => {
    it('should call authService.studentLogin', async () => {
      const dto = { display_name: 'student', password: 'password' };
      mockAuthService.studentLogin.mockResolvedValue({ access_token: 'token' });
      const result = await controller.studentLogin(dto);
      expect(result).toEqual({ access_token: 'token' });
      expect(service.studentLogin).toHaveBeenCalledWith(dto);
    });
  });

  describe('switchToChild', () => {
    it('should call authService.switchToChild with guardian id and studentId', async () => {
      const req = { user: { sub: 'guardian-1' } };
      mockAuthService.switchToChild.mockResolvedValue({ access_token: 'child_token' });
      const result = await controller.switchToChild(req, 'student-1');
      expect(result).toEqual({ access_token: 'child_token' });
      expect(service.switchToChild).toHaveBeenCalledWith('guardian-1', 'student-1');
    });
  });
});
