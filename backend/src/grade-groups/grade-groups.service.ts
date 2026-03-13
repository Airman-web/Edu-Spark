import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GradeGroupsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma.gradeGroup as any).findMany();
  }

  findOne(id: string) {
    return (this.prisma.gradeGroup as any).findUnique({
      where: { grade_group_id: id },
    });
  }

  create(createGradeGroupDto: any) {
    return (this.prisma.gradeGroup as any).create({
      data: createGradeGroupDto,
    });
  }

  async createInitialGroups() {
    const groups = [
      { name: 'P1', description: 'Primary 1' },
      { name: 'P2', description: 'Primary 2' },
      { name: 'P3', description: 'Primary 3' },
    ];

    for (const group of groups) {
      await (this.prisma.gradeGroup as any).upsert({
        where: { name: group.name },
        update: {},
        create: group,
      });
    }
  }
}
