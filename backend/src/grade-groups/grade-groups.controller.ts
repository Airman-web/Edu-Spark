import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GradeGroupsService } from './grade-groups.service';
import { GradeGroupDto } from './dto/grade-group.dto';
import { CreateGradeGroupDto } from './dto/create-grade-group.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('grade-groups')
@ApiBearerAuth()
@Controller('grade-groups')
export class GradeGroupsController {
  constructor(private readonly gradeGroupsService: GradeGroupsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available grade groups' })
  @ApiResponse({
    status: 200,
    description: 'Return all grade groups.',
    type: [GradeGroupDto],
  })
  findAll() {
    return this.gradeGroupsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new grade group' })
  @ApiResponse({
    status: 201,
    description: 'Grade group successfully created.',
    type: GradeGroupDto,
  })
  create(@Body() createGradeGroupDto: CreateGradeGroupDto) {
    return this.gradeGroupsService.create(createGradeGroupDto);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed initial grade groups (P1, P2, P3)' })
  @ApiResponse({
    status: 201,
    description: 'Grade groups successfully seeded.',
    type: [GradeGroupDto],
  })
  seed() {
    return this.gradeGroupsService.createInitialGroups();
  }
}
