import { Test, TestingModule } from '@nestjs/testing';
import { GuardiansController } from './guardians.controller';
import { GuardiansService } from './guardians.service';
import { JwtService } from '@nestjs/jwt';

import { CoursesService } from '../courses/courses.service';

describe('GuardiansController', () => {
  let controller: GuardiansController;

  const mockGuardiansService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockCoursesService = {
    getStudentEnrollments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardiansController],
      providers: [
        { provide: GuardiansService, useValue: mockGuardiansService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: CoursesService, useValue: mockCoursesService },
      ],
    }).compile();

    controller = module.get<GuardiansController>(GuardiansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
