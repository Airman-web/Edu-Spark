import { Test, TestingModule } from '@nestjs/testing';
import { GradeGroupsController } from './grade-groups.controller';

describe('GradeGroupsController', () => {
  let controller: GradeGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeGroupsController],
    }).compile();

    controller = module.get<GradeGroupsController>(GradeGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
