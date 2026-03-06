import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GuardiansModule } from './guardians/guardians.module';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProgressModule } from './progress/progress.module';
import { PointsModule } from './points/points.module';
import { GradeGroupsModule } from './grade-groups/grade-groups.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GuardiansModule,
    StudentsModule,
    CoursesModule,
    LessonsModule,
    QuizzesModule,
    ProgressModule,
    PointsModule,
    GradeGroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
