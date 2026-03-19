import { Module, forwardRef } from '@nestjs/common';
import { GuardiansService } from './guardians.service';
import { GuardiansController } from './guardians.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), CoursesModule],
  controllers: [GuardiansController],
  providers: [GuardiansService],
  exports: [GuardiansService],
})
export class GuardiansModule {}
