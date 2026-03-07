import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PointsService } from './points.service';
import {
  PointHistoryResponseDto,
  PointTotalResponseDto,
} from './dto/points-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
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
}
