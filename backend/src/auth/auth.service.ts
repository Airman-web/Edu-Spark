import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GuardiansService } from '../guardians/guardians.service';
import { StudentsService } from '../students/students.service';
import { CreateGuardianDto } from '../guardians/dto/create-guardian.dto';
import { LoginDto } from './dto/login.dto';
import { StudentLoginDto } from './dto/student-login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private guardiansService: GuardiansService,
    private studentsService: StudentsService,
    private jwtService: JwtService,
  ) {}

  async signup(createGuardianDto: CreateGuardianDto) {
    const guardian = await this.guardiansService.create(createGuardianDto);
    return this.generateToken(guardian, 'guardian');
  }

  async login(loginDto: LoginDto) {
    const guardian = await this.guardiansService.findByEmail(loginDto.email);
    
    if (guardian && (await bcrypt.compare(loginDto.password, guardian.password))) {
      return this.generateToken(guardian, 'guardian');
    }
    
    throw new UnauthorizedException('Invalid credentials');
  }

  async studentLogin(studentLoginDto: StudentLoginDto) {
    const student = await this.studentsService.findByDisplayName(studentLoginDto.display_name);

    if (student && (await bcrypt.compare(studentLoginDto.password, (student as any).password))) {
      return this.generateToken(student, 'student');
    }

    throw new UnauthorizedException('Invalid student credentials');
  }

  private async generateToken(user: any, role: 'guardian' | 'student') {
    const payload = { 
      sub: role === 'guardian' ? user.guardian_id : user.student_id, 
      email: role === 'guardian' ? user.email : user.display_name,
      role: role 
    };
    
    const userData: any = {
      id: payload.sub,
      full_name: user.full_name,
      role: role,
    };

    if (role === 'guardian') {
      userData.email = user.email;
    } else {
      userData.display_name = user.display_name;
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userData
    };
  }
}
