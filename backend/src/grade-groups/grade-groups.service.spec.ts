import { Test, TestingModule } from '@nestjs/testing';
import { GradeGroupsService } from './grade-groups.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GradeGroupsService', () => {
  let service: GradeGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradeGroupsService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GradeGroupsService>(GradeGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
