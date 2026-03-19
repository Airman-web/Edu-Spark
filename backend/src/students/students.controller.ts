import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('students')
@ApiBearerAuth()
@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Guardian creates a student profile' })
  @ApiResponse({
    status: 201,
    description: 'Student profile created.',
    type: StudentResponseDto,
  })
  create(@Request() req, @Body() createStudentDto: CreateStudentDto) {
    return (this.studentsService as any).create(req.user.sub, createStudentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all students belonging to the logged-in guardian',
  })
  @ApiResponse({
    status: 200,
    description: 'Return list of students.',
    type: [StudentResponseDto],
  })
  findAll(@Request() req) {
    return (this.studentsService as any).findAllByGuardian(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details for a specific student profile' })
  @ApiResponse({
    status: 200,
    description: 'Return student details.',
    type: StudentResponseDto,
  })
  findOne(@Request() req, @Param('id') id: string) {
    return (this.studentsService as any).findOneForGuardian(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Guardian updates a student profile' })
  @ApiResponse({
    status: 200,
    description: 'Student profile updated.',
    type: StudentResponseDto,
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return (this.studentsService as any).updateForGuardian(
      id,
      req.user.sub,
      updateStudentDto,
    );
  }
}
