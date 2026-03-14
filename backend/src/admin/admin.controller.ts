import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import {
  DashboardStatsDto,
  AdminStudentResponseDto,
  AdminGuardianResponseDto,
  AdminCourseResponseDto,
  AdminLessonResponseDto,
} from './dto/admin-response.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  RegisterGuardianDto,
  RegisterStudentDto,
} from './dto/registration.dto';

@ApiTags('admin')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing token',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get overall dashboard statistics' })
  @ApiOkResponse({
    description: 'Statistics retrieved successfully',
    type: DashboardStatsDto,
  })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('students')
  @ApiOperation({ summary: 'Get all students' })
  @ApiOkResponse({
    description: 'List of all students retrieved successfully',
    type: [AdminStudentResponseDto],
  })
  getAllStudents() {
    return this.adminService.getAllStudents();
  }

  @Get('guardians')
  @ApiOperation({ summary: 'Get all guardians' })
  @ApiOkResponse({
    description: 'List of all guardians retrieved successfully',
    type: [AdminGuardianResponseDto],
  })
  getAllGuardians() {
    return this.adminService.getAllGuardians();
  }

  @Get('courses')
  @ApiOperation({ summary: 'Get all courses' })
  @ApiOkResponse({
    description: 'List of all courses retrieved successfully',
    type: [AdminCourseResponseDto],
  })
  getAllCourses() {
    return this.adminService.getAllCourses();
  }

  @Get('recent-guardians')
  @ApiOperation({ summary: 'Get most recently registered guardians' })
  @ApiOkResponse({
    description: 'Recent guardians list retrieved successfully',
    type: [AdminGuardianResponseDto],
  })
  getRecentGuardians(@Query('limit') limit?: number) {
    return this.adminService.getRecentGuardians(limit ? +limit : 5);
  }

  @Post('courses')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiOkResponse({
    description: 'Course created successfully',
    type: AdminCourseResponseDto,
  })
  @ApiConflictResponse({
    description: 'Course with this title already exists for the grade group',
  })
  @ApiNotFoundResponse({ description: 'Grade group not found' })
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.adminService.createCourse(createCourseDto);
  }

  @Patch('course/:id')
  @ApiOperation({ summary: 'Update an existing course' })
  @ApiOkResponse({
    description: 'Course updated successfully',
    type: AdminCourseResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiConflictResponse({
    description: 'Course with this title already exists for the grade group',
  })
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.adminService.updateCourse(id, updateCourseDto);
  }

  @Delete('course/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a course' })
  @ApiOkResponse({ description: 'Course deleted successfully' })
  @ApiNotFoundResponse({ description: 'Course not found' })
  deleteCourse(@Param('id') id: string) {
    return this.adminService.deleteCourse(id);
  }

  @Post('register-guardian')
  @ApiOperation({ summary: 'Register a new guardian' })
  @ApiOkResponse({ description: 'Guardian registered successfully' })
  @ApiConflictResponse({ description: 'Email or phone number already exists' })
  registerGuardian(@Body() registerGuardianDto: RegisterGuardianDto) {
    return this.adminService.registerGuardian(registerGuardianDto);
  }

  @Post('register-student')
  @ApiOperation({ summary: 'Register a new student' })
  @ApiOkResponse({ description: 'Student registered successfully' })
  @ApiConflictResponse({ description: 'Display name already exists' })
  @ApiNotFoundResponse({ description: 'Guardian or Grade Group not found' })
  registerStudent(@Body() registerStudentDto: RegisterStudentDto) {
    return this.adminService.registerStudent(registerStudentDto);
  }

  @Post('lesson')
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiOkResponse({
    description: 'Lesson created successfully',
    type: AdminLessonResponseDto,
  })
  @ApiConflictResponse({
    description: 'Lesson with this title already exists for the course',
  })
  @ApiNotFoundResponse({ description: 'Course not found' })
  createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.adminService.createLesson(createLessonDto);
  }

  @Patch('lesson/:id')
  @ApiOperation({ summary: 'Update an existing lesson' })
  @ApiOkResponse({
    description: 'Lesson updated successfully',
    type: AdminLessonResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Lesson or Course not found' })
  @ApiConflictResponse({
    description: 'Lesson with this title already exists for the course',
  })
  updateLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.adminService.updateLesson(id, updateLessonDto);
  }

  @Delete('lesson/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiOkResponse({ description: 'Lesson deleted successfully' })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  deleteLesson(@Param('id') id: string) {
    return this.adminService.deleteLesson(id);
  }

  @Get('lesson')
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiOkResponse({
    description: 'List of all lessons retrieved successfully',
    type: [AdminLessonResponseDto],
  })
  getAllLessons() {
    return this.adminService.getAllLessons();
  }

  @Get('lesson/:id')
  @ApiOperation({ summary: 'Get details of a specific lesson' })
  @ApiOkResponse({
    description: 'Lesson details retrieved successfully',
    type: AdminLessonResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  getLessonById(@Param('id') id: string) {
    return this.adminService.getLessonById(id);
  }

  @Get('lessons/course/:courseId')
  @ApiOperation({ summary: 'Get lessons for a specific course' })
  @ApiOkResponse({
    description: 'List of lessons for the course retrieved successfully',
    type: [AdminLessonResponseDto],
  })
  getLessonsByCourse(@Param('courseId') courseId: string) {
    return this.adminService.getLessonsByCourse(courseId);
  }
}
