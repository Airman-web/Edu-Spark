import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  DashboardStatsDto,
  AdminStudentResponseDto,
  AdminGuardianResponseDto,
  AdminCourseResponseDto,
} from './dto/admin-response.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@ApiTags('admin')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing token',
})
@UseGuards(JwtAuthGuard)
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
}
