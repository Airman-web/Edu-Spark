import { Controller, Get, Post, Body, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { GradeGroupsService } from './grade-groups.service';
import { GradeGroupDto } from './dto/grade-group.dto';
import { CreateGradeGroupDto } from './dto/create-grade-group.dto';
import { UpdateGradeGroupDto } from './dto/update-grade-group.dto';
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update a grade group' })
  @ApiResponse({
    status: 200,
    description: 'Grade group successfully updated.',
    type: GradeGroupDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateGradeGroupDto: UpdateGradeGroupDto,
  ) {
    return this.gradeGroupsService.update(id, updateGradeGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a grade group' })
  @ApiResponse({
    status: 200,
    description: 'Grade group successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.gradeGroupsService.remove(id);
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
