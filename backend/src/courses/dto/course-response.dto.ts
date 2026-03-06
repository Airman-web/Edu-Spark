import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty({ example: 'c1-550e8400-e29b-41d4-a716-446655440000' })
  course_id: string;

  @ApiProperty({ example: 'gg1-550e8400-e29b-41d4-a716-446655440000' })
  grade_group_id: string;

  @ApiProperty({ example: 'Mathematics 101' })
  title: string;

  @ApiProperty({ example: 'Basic arithmetic and geometry', required: false })
  description?: string;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;
}
