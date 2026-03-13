import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({
    status: 201,
    description: 'Course successfully created.',
    type: CourseResponseDto,
  })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all courses, optionally filtered by grade group (public)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return list of courses.',
    type: [CourseResponseDto],
  })
  findAll(@Query('gradeGroupId') gradeGroupId?: string) {
    return (this.coursesService as any).findAll(gradeGroupId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific course (public)' })
  @ApiResponse({
    status: 200,
    description: 'Return course details.',
    type: CourseResponseDto,
  })
  findOne(@Param('id') id: string) {
    return (this.coursesService as any).findOne(id);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll a student in a course (requires login)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 201, description: 'Student enrolled successfully.' })
  @ApiResponse({ status: 409, description: 'Already enrolled in this course.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  enroll(
    @Param('id') courseId: string,
    @Request() req,
  ) {
    return this.coursesService.enroll(courseId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('student/:studentId/enrollments')
  @ApiOperation({ summary: 'Get all courses a student is enrolled in (requires login)' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'List of enrollments with course details.',
  })
  getStudentEnrollments(@Param('studentId') studentId: string) {
    return this.coursesService.getStudentEnrollments(studentId);
  }
}
