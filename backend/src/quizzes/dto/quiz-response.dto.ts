import { ApiProperty } from '@nestjs/swagger';

class QuizOptionResponseDto {
  @ApiProperty({
    example: 'o1-550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique option ID',
  })
  option_id: string;

  @ApiProperty({ example: 'Paris' })
  option_text: string;

  @ApiProperty({ example: true })
  is_correct: boolean;
}

class QuizQuestionResponseDto {
  @ApiProperty({
    example: 'qn1-550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique question ID',
  })
  question_id: string;

  @ApiProperty({ example: 'What is the capital of France?' })
  question_text: string;

  @ApiProperty({ example: 10 })
  points: number;

  @ApiProperty({ type: [QuizOptionResponseDto] })
  options: QuizOptionResponseDto[];
}

export class QuizResponseDto {
  @ApiProperty({
    example: 'q1-550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique quiz ID',
  })
  quiz_id: string;

  @ApiProperty({
    example: 'l1-550e8400-e29b-41d4-a716-446655440000',
    description: 'ID of the associated lesson',
  })
  lesson_id: string;

  @ApiProperty({ example: 100 })
  total_points: number;

  @ApiProperty({ example: false })
  is_timed: boolean;

  @ApiProperty({ example: 600, required: false })
  time_limit_seconds?: number;

  @ApiProperty({ type: [QuizQuestionResponseDto] })
  questions: QuizQuestionResponseDto[];

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;
}
