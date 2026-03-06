import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateLessonProgressDto, RecordQuizAttemptDto } from './dto/progress.dto';
import { LessonProgressResponseDto, QuizAttemptResponseDto, StudentProgressSummaryDto } from './dto/progress-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lesson')
  @ApiOperation({ summary: 'Mark a lesson as completed' })
  @ApiResponse({ status: 201, description: 'Lesson progress updated.', type: LessonProgressResponseDto })
  updateLesson(@Request() req, @Body() dto: UpdateLessonProgressDto) {
    const studentId = req.user.student_id;
    return this.progressService.updateLessonProgress(studentId, dto);
  }

  @Post('quiz')
  @ApiOperation({ summary: 'Record a quiz attempt and score' })
  @ApiResponse({ status: 201, description: 'Quiz attempt recorded.', type: QuizAttemptResponseDto })
  recordQuiz(@Request() req, @Body() dto: RecordQuizAttemptDto) {
    const studentId = req.user.student_id;
    return this.progressService.recordQuizAttempt(studentId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get the overall learning progress for the logged-in student' })
  @ApiResponse({ status: 200, description: 'Return student progress details.', type: StudentProgressSummaryDto })
  getProgress(@Request() req) {
    const studentId = req.user.student_id;
    return this.progressService.getStudentProgress(studentId);
  }
}
