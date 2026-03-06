import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}

  async addPoints(studentId: string, points: number, sourceType: string) {
    return (this.prisma.pointsHistory as any).create({
      data: {
        student_id: studentId,
        points: points,
        source_type: sourceType,
      },
    });
  }

  async getHistory(studentId: string) {
    return (this.prisma.pointsHistory as any).findMany({
      where: { student_id: studentId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getTotalPoints(studentId: string) {
    const aggregate = await (this.prisma.pointsHistory as any).aggregate({
      where: { student_id: studentId },
      _sum: {
        points: true,
      },
    });
    return aggregate._sum.points || 0;
  }
}
