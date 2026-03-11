import { Test, TestingModule } from '@nestjs/testing';
import { GuardiansController } from './guardians.controller';
import { GuardiansService } from './guardians.service';
import { JwtService } from '@nestjs/jwt';

describe('GuardiansController', () => {
  let controller: GuardiansController;

  const mockGuardiansService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardiansController],
      providers: [
        { provide: GuardiansService, useValue: mockGuardiansService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<GuardiansController>(GuardiansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
