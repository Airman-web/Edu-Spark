import { Injectable, ConflictException } from '@nestjs/common';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GuardiansService {
  constructor(private prisma: PrismaService) {}

  async create(createGuardianDto: CreateGuardianDto) {
    const { password, ...rest } = createGuardianDto;

    // Check if email already exists
    const existing = await (this.prisma.guardian as any).findUnique({
      where: { email: rest.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return (this.prisma.guardian as any).create({
      data: {
        ...rest,
        password: hashedPassword,
      },
      select: {
        guardian_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        created_at: true,
      },
    });
  }

  async findByEmail(email: string) {
    return (this.prisma.guardian as any).findUnique({
      where: { email },
    });
  }

  async findOne(id: string) {
    return (this.prisma.guardian as any).findUnique({
      where: { guardian_id: id },
      select: {
        guardian_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        created_at: true,
      },
    });
  }
}
