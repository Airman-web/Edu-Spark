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
import { RegisterSystemUserDto } from './dto/register-system-user.dto'; // Added import
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
  ApiResponse, // Kept ApiResponse for login/student-login
  ApiCreatedResponse, // Added ApiCreatedResponse
  ApiOkResponse, // Added ApiOkResponse, though not explicitly used in the diff for existing methods, it's in the provided import list
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Guardian signup' }) // Modified summary
  @ApiCreatedResponse({ description: 'Guardian registered successfully' }) // Changed from ApiResponse to ApiCreatedResponse
  async signup(@Body() createGuardianDto: CreateGuardianDto) {
    return this.authService.signup(createGuardianDto);
  }

  @Post('register/system')
  @ApiOperation({ summary: 'System user registration (Admin)' })
  @ApiCreatedResponse({ description: 'System user registered successfully' })
  registerSystemUser(@Body() registerSystemUserDto: RegisterSystemUserDto) {
    return this.authService.registerSystemUser(registerSystemUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Consolidated login (Guardian & Admin)' })
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
