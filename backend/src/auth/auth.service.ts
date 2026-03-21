import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GuardiansService } from '../guardians/guardians.service';
import { StudentsService } from '../students/students.service';
import { CreateGuardianDto } from '../guardians/dto/create-guardian.dto';
import { LoginDto } from './dto/login.dto';
import { StudentLoginDto } from './dto/student-login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterSystemUserDto } from './dto/register-system-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private guardiansService: GuardiansService,
    private studentsService: StudentsService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async signup(createGuardianDto: CreateGuardianDto) {
    const guardian = await this.guardiansService.create(createGuardianDto);
    return this.generateToken(guardian, 'guardian');
  }

  async registerSystemUser(registerSystemUserDto: RegisterSystemUserDto) {
    const { registrationSecret, fullName, email, password } = registerSystemUserDto;
    const secret =
      this.configService.get<string>('SYSTEM_REGISTRATION_SECRET') || 'my-super-secret-key';

    if (registrationSecret !== secret) {
      throw new UnauthorizedException('Invalid registration secret');
    }

    // Check if email already exists
    const existing = await this.prisma.systemAdmin.findUnique({
      where: { email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin directly in the database
    const admin = await this.prisma.systemAdmin.create({
      data: {
        email,
        password: hashedPassword,
        full_name: fullName,
      },
    });

    return this.generateToken(admin, 'admin');
  }

  async login(loginDto: LoginDto) {
    // 1. Try Admin login
    const admin = await this.prisma.systemAdmin.findUnique({
      where: { email: loginDto.email },
    });

    if (
      admin &&
      (await bcrypt.compare(loginDto.password, admin.password))
    ) {
      return this.generateToken(admin, 'admin');
    }

    // 2. Try Guardian login
    const guardian = await this.guardiansService.findByEmail(loginDto.email);

    if (
      guardian &&
      (await bcrypt.compare(loginDto.password, guardian.password))
    ) {
      return this.generateToken(guardian, 'guardian');
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async switchToChild(guardianId: string, studentId: string) {
    const student = await (this.prisma.student as any).findUnique({
      where: { student_id: studentId },
    });

    if (!student) {
      throw new UnauthorizedException('Student not found');
    }

    if (student.guardian_id !== guardianId) {
      throw new UnauthorizedException('This student does not belong to you');
    }

    return this.generateToken(student, 'student');
  }

  async studentLogin(studentLoginDto: StudentLoginDto) {
    const student = await this.studentsService.findByDisplayName(
      studentLoginDto.display_name,
    );

    if (
      student &&
      (await bcrypt.compare(studentLoginDto.password, student.password))
    ) {
      return this.generateToken(student, 'student');
    }

    throw new UnauthorizedException('Invalid student credentials');
  }

  private async generateToken(user: any, userType: 'guardian' | 'student' | 'admin') {
    const role = userType;
    const sub = 
      userType === 'admin' ? user.admin_id : 
      userType === 'guardian' ? user.guardian_id : 
      user.student_id;
    
    const email = userType === 'student' ? user.display_name : user.email;

    const payload = {
      sub,
      email,
      role,
    };

    const userData: any = {
      id: sub,
      full_name: user.full_name,
      role,
    };

    if (userType !== 'student') {
      userData.email = user.email;
    } else {
      userData.display_name = user.display_name;
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userData,
    };
  }
}
