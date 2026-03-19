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
  async getLeaderboard(timeframe?: string) {
    let whereClause = {};
    if (timeframe === 'weekly') {
      const now = new Date();
      // Get the start of the current week (Sunday)
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);

      whereClause = {
        created_at: {
          gte: startOfWeek,
        },
      };
    }

    const leaderboard = await (this.prisma.pointsHistory as any).groupBy({
      by: ['student_id'],
      where: whereClause,
      _sum: {
        points: true,
      },
      orderBy: {
        _sum: {
          points: 'desc',
        },
      },
    });

    // Populate student information
    const populatedLeaderboard = await Promise.all(
      leaderboard.map(async (entry) => {
        const student = await (this.prisma.student as any).findUnique({
          where: { student_id: entry.student_id },
          select: { full_name: true, profile_image_url: true, display_name: true },
        });
        return {
          student_id: entry.student_id,
          name: student ? student.display_name || student.full_name : 'Unknown Student',
          profile_image_url: student?.profile_image_url,
          total_points: Number(entry._sum.points) || 0,
        };
      })
    );

    return populatedLeaderboard.sort((a, b) => b.total_points - a.total_points);
  }

  async getStudentWeeklyPoints(studentId: string) {
    const history = await (this.prisma.pointsHistory as any).findMany({
      where: { student_id: studentId },
      orderBy: { created_at: 'asc' },
    });

    const weeklyPoints: { [weekStart: string]: number } = {};

    history.forEach((record) => {
      const date = new Date(record.created_at);
      // Get the start of the week for this record (Sunday)
      const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      
      const weekKey = startOfWeek.toISOString().split('T')[0];

      if (!weeklyPoints[weekKey]) {
        weeklyPoints[weekKey] = 0;
      }
      weeklyPoints[weekKey] += Number(record.points);
    });

    // Convert object to array for easier charting
    return Object.keys(weeklyPoints).map((weekStart) => ({
      week: weekStart,
      points: weeklyPoints[weekStart],
    })).sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }

  async getAllStudentsWeeklyPoints() {
    const history = await (this.prisma.pointsHistory as any).findMany({
      orderBy: { created_at: 'asc' },
    });

    const weeklyPoints: { [weekStart: string]: number } = {};

    history.forEach((record) => {
      const date = new Date(record.created_at);
      // Get the start of the week for this record (Sunday)
      const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      
      const weekKey = startOfWeek.toISOString().split('T')[0];

      if (!weeklyPoints[weekKey]) {
        weeklyPoints[weekKey] = 0;
      }
      weeklyPoints[weekKey] += Number(record.points);
    });

    // Convert object to array for easier charting
    return Object.keys(weeklyPoints).map((weekStart) => ({
      week: weekStart,
      points: weeklyPoints[weekStart],
    })).sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }
}
