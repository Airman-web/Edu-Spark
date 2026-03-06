import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course successfully created.', type: CourseResponseDto })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all courses, optionally filtered by grade group' })
  @ApiResponse({ status: 200, description: 'Return list of courses.', type: [CourseResponseDto] })
  findAll(@Request() req, @Query('gradeGroupId') gradeGroupId?: string) {
    return (this.coursesService as any).findAll(gradeGroupId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific course' })
  @ApiResponse({ status: 200, description: 'Return course details.', type: CourseResponseDto })
  findOne(@Param('id') id: string) {
    return (this.coursesService as any).findOne(id);
  }
}
