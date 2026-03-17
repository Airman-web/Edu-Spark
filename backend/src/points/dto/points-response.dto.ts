import { ApiProperty } from '@nestjs/swagger';

export class PointHistoryResponseDto {
  @ApiProperty({ example: 'ph1-550e8400-e29b-41d4-a716-446655440000' })
  history_id: string;

  @ApiProperty({ example: 's1-550e8400-e29b-41d4-a716-446655440000' })
  student_id: string;

  @ApiProperty({ example: 10 })
  points: number;

  @ApiProperty({ example: 'Completed lesson: Counting to 10' })
  reason: string;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;
}

export class PointTotalResponseDto {
  @ApiProperty({ example: 150 })
  total_points: number;
}

export class LeaderboardResponseDto {
  @ApiProperty({ example: 's1-550e8400-e29b-41d4-a716-446655440000' })
  student_id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  profile_image_url?: string;

  @ApiProperty({ example: 1250 })
  total_points: number;
}

export class WeeklyPointsResponseDto {
  @ApiProperty({ example: '2026-03-15' })
  week: string;

  @ApiProperty({ example: 450 })
  points: number;
}
