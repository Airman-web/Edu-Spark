import { ApiProperty } from '@nestjs/swagger';

export class CourseSummaryDto {
  @ApiProperty({ example: 'c1-550e8400-e29b-41d4-a716-446655440000' })
  course_id: string;

  @ApiProperty({ example: 'Mathematics 101' })
  title: string;

  @ApiProperty({ example: 'Basic arithmetic' })
  description: string;
}

export class LessonResponseDto {
  @ApiProperty({ example: 'l1-550e8400-e29b-41d4-a716-446655440000' })
  lesson_id: string;

  @ApiProperty({ example: 'c1-550e8400-e29b-41d4-a716-446655440000' })
  course_id: string;

  @ApiProperty({ example: 'Counting to 10' })
  title: string;

  @ApiProperty({ example: 'video', enum: ['video', 'reading'] })
  content_type: string;

  @ApiProperty({ example: 'https://youtube.com/...' })
  content: string;

  @ApiProperty({ example: 10 })
  points_reward: number;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ type: CourseSummaryDto })
  course: CourseSummaryDto;
}
