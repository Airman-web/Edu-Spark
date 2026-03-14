import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizResponseDto } from './dto/quiz-response.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('quizzes')
@ApiBearerAuth()
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new quiz (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Quiz successfully created.',
    type: QuizResponseDto,
  })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific quiz by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Return quiz details.',
    type: QuizResponseDto,
  })
  findOne(@Param('id') id: string) {
    return (this.quizzesService as any).findOne(id);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get the quiz associated with a specific lesson' })
  @ApiResponse({
    status: 200,
    description: 'Return quiz for the lesson.',
    type: QuizResponseDto,
  })
  findOneByLesson(@Param('lessonId') lessonId: string) {
    return (this.quizzesService as any).findOneByLesson(lessonId);
  }
}
