import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GuardiansService } from './guardians.service';

@ApiTags('guardians')
@ApiBearerAuth()
@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current guardian profile' })
  @ApiOkResponse({ description: 'Profile retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return this.guardiansService.findOne(req.user.sub);
  }

  @Get('students/performance')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get performance of all students under the current guardian' })
  @ApiOkResponse({ description: 'Student performance retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getStudentPerformance(@Request() req) {
    return this.guardiansService.getStudentPerformance(req.user.sub);
  }
}
