import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizResponseDto } from './dto/quiz-response.dto';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('quizzes')
@ApiBearerAuth()
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all quizzes with their associated lessons' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'lessonId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Return list of all quizzes.',
    type: [QuizResponseDto],
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('lessonId') lessonId?: string,
  ) {
    return this.quizzesService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      lessonId,
    });
  }

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
    return this.quizzesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a quiz (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Quiz successfully updated.',
    type: QuizResponseDto,
  })
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a quiz (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Quiz successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get the quiz associated with a specific lesson' })
  @ApiResponse({
    status: 200,
    description: 'Return quiz for the lesson.',
    type: QuizResponseDto,
  })
  findOneByLesson(@Param('lessonId') lessonId: string) {
    return this.quizzesService.findOneByLesson(lessonId);
  }

  @Get('lesson/:lessonId/all')
  @ApiOperation({ summary: 'Get all quizzes associated with a specific lesson' })
  @ApiResponse({
    status: 200,
    description: 'Return all quizzes for the lesson.',
    type: [QuizResponseDto],
  })
  findAllByLesson(@Param('lessonId') lessonId: string) {
    return this.quizzesService.findAllByLesson(lessonId);
  }
}
