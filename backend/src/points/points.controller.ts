import { Controller, Get, UseGuards, Request, Query, Param } from '@nestjs/common';
import { PointsService } from './points.service';
import {
  PointHistoryResponseDto,
  PointTotalResponseDto,
  LeaderboardResponseDto,
  WeeklyPointsResponseDto,
} from './dto/points-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('points')
@ApiBearerAuth()
@Controller('points')
@UseGuards(JwtAuthGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('history')
  @ApiOperation({
    summary: 'Get the points earning history for the logged-in student',
  })
  @ApiResponse({
    status: 200,
    description: 'Return points history.',
    type: [PointHistoryResponseDto],
  })
  getHistory(@Request() req) {
    const studentId = req.user.student_id;
    return this.pointsService.getHistory(studentId);
  }

  @Get('total')
  @ApiOperation({
    summary: 'Get the current total points balance for the logged-in student',
  })
  @ApiResponse({
    status: 200,
    description: 'Return total points sum.',
    type: PointTotalResponseDto,
  })
  getTotal(@Request() req) {
    const studentId = req.user.student_id;
    return this.pointsService.getTotalPoints(studentId);
  }
  @Get('leaderboard')
  @ApiOperation({
    summary: 'Get the student leaderboard (Admin/Global)',
  })
  @ApiQuery({
    name: 'timeframe',
    required: false,
    description: 'Filter timeframe. Pass "weekly" to get only this week\'s points.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return student leaderboard by points sorted descending.',
    type: [LeaderboardResponseDto],
  })
  getLeaderboard(@Query('timeframe') timeframe?: string) {
    return this.pointsService.getLeaderboard(timeframe);
  }

  @Get('all-student/weekly')
  @ApiOperation({
    summary: 'Get weekly aggregated points for all students (Admin/Global)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return array mapping week start dates to points earned across all students.',
    type: [WeeklyPointsResponseDto],
  })
  getAllStudentsWeeklyPoints() {
    return this.pointsService.getAllStudentsWeeklyPoints();
  }

  @Get('student/:studentId/weekly')
  @ApiOperation({
    summary: 'Get weekly aggregated points for a specific student chart',
  })
  @ApiResponse({
    status: 200,
    description: 'Return array of objects mapping week start dates to points earned.',
    type: [WeeklyPointsResponseDto],
  })
  getStudentWeeklyPoints(@Param('studentId') studentId: string) {
    return this.pointsService.getStudentWeeklyPoints(studentId);
  }
}
