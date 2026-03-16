import { Test, TestingModule } from '@nestjs/testing';
import { GradeGroupsController } from './grade-groups.controller';
import { GradeGroupsService } from './grade-groups.service';

describe('GradeGroupsController', () => {
  let controller: GradeGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeGroupsController],
      providers: [
        {
          provide: GradeGroupsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<GradeGroupsController>(GradeGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
