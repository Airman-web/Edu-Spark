import { ApiProperty } from '@nestjs/swagger';

export class LessonProgressResponseDto {
  @ApiProperty({
    example: 'p1-550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique progress ID',
  })
  progress_id: string;

  @ApiProperty({
    example: 's1-550e8400-e29b-41d4-a716-446655440000',
    description: 'Student UUID',
  })
  student_id: string;

  @ApiProperty({
    example: 'l1-550e8400-e29b-41d4-a716-446655440000',
    description: 'Lesson UUID',
  })
  lesson_id: string;

  @ApiProperty({ example: true })
  completed: boolean;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  last_accessed: Date;
}

export class QuizAttemptResponseDto {
  @ApiProperty({
    example: 'a1-550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique attempt ID',
  })
  attempt_id: string;

  @ApiProperty({
    example: 's1-550e8400-e29b-41d4-a716-446655440000',
    description: 'Student UUID',
  })
  student_id: string;

  @ApiProperty({
    example: 'q1-550e8400-e29b-41d4-a716-446655440000',
    description: 'Quiz UUID',
  })
  quiz_id: string;

  @ApiProperty({ example: 85 })
  score: number;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  attempted_at: Date;
}

export class StudentProgressSummaryDto {
  @ApiProperty({ type: [LessonProgressResponseDto] })
  completed_lessons: LessonProgressResponseDto[];

  @ApiProperty({ type: [QuizAttemptResponseDto] })
  quiz_attempts: QuizAttemptResponseDto[];

  @ApiProperty({ example: 120 })
  total_points: number;
}
