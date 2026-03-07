import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateGuardianDto } from '../guardians/dto/create-guardian.dto';
import { LoginDto } from './dto/login.dto';
import { StudentLoginDto } from './dto/student-login.dto';
import { GuardianResponseDto } from '../guardians/dto/guardian-response.dto';
import {
  LoginResponseDto,
  StudentLoginResponseDto,
} from './dto/login-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new guardian' })
  @ApiResponse({
    status: 201,
    description: 'Guardian successfully registered.',
    type: GuardianResponseDto,
  })
  async signup(@Body() createGuardianDto: CreateGuardianDto) {
    return this.authService.signup(createGuardianDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Guardian login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns access token and user info.',
    type: LoginResponseDto,
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('student-login')
  @ApiOperation({ summary: 'Student login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns access token and user info.',
    type: StudentLoginResponseDto,
  })
  async studentLogin(@Body() studentLoginDto: StudentLoginDto) {
    return this.authService.studentLogin(studentLoginDto);
  }
}
