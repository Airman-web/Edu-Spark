import { Module } from '@nestjs/common';
import { GradeGroupsService } from './grade-groups.service';
import { GradeGroupsController } from './grade-groups.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GradeGroupsController],
  providers: [GradeGroupsService],
  exports: [GradeGroupsService],
})
export class GradeGroupsModule {}
