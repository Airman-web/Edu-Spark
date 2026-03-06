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
