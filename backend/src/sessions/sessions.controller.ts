import { Controller, Post, Get, Body, Request, UseGuards, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionResponseDto, TotalTimeResponseDto } from './dto/session-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('student')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Record a study session when student leaves the site' })
  @ApiResponse({ status: 201, description: 'Session recorded.', type: SessionResponseDto })
  recordSession(@Request() req, @Body() dto: CreateSessionDto) {
    const studentId = req.user.sub;
    return this.sessionsService.recordSession(studentId, dto);
  }

  @Get('total-time')
  @ApiOperation({ summary: 'Get total time the student has spent on the platform' })
  @ApiResponse({ status: 200, description: 'Total time in seconds.', type: TotalTimeResponseDto })
  getTotalTime(@Request() req) {
    const studentId = req.user.sub;
    return this.sessionsService.getTotalTime(studentId);
  }

  @Get('child/:studentId/total-time')
  @Roles('guardian')
  @ApiOperation({ summary: "Get total time a guardian's child has spent on the platform" })
  @ApiResponse({ status: 200, description: 'Total time in seconds.', type: TotalTimeResponseDto })
  getChildTotalTime(@Request() req, @Param('studentId') studentId: string) {
    const guardianId = req.user.sub;
    return this.sessionsService.getChildTotalTime(guardianId, studentId);
  }
}
