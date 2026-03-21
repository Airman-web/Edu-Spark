import { Test, TestingModule } from '@nestjs/testing';
import { GuardiansService } from './guardians.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('GuardiansService', () => {
  let service: GuardiansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuardiansService,
        { provide: PrismaService, useValue: {} },
        { provide: NotificationsService, useValue: { notifyAllAdmins: jest.fn() } },
      ],
    }).compile();

    service = module.get<GuardiansService>(GuardiansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
