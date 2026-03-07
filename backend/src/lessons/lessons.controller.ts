import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonResponseDto } from './dto/lesson-response.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('lessons')
@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({
    status: 201,
    description: 'Lesson successfully created.',
    type: LessonResponseDto,
  })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons, optionally filtered by course' })
  @ApiResponse({
    status: 200,
    description: 'Return list of lessons.',
    type: [LessonResponseDto],
  })
  findAll(@Query('courseId') courseId?: string) {
    return (this.lessonsService as any).findAll(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific lesson' })
  @ApiResponse({
    status: 200,
    description: 'Return lesson details.',
    type: LessonResponseDto,
  })
  findOne(@Param('id') id: string) {
    return (this.lessonsService as any).findOne(id);
  }
}
