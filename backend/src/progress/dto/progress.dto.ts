import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDecimal,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonProgressDto {
  @ApiProperty({ example: 'uuid-string' })
  @IsString()
  @IsNotEmpty()
  lesson_id: string;

  @ApiProperty({
    example: 50,
    description: 'Percentage of lesson completed (0-100)',
  })
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  progress_percentage: number;
}

export class RecordQuizAttemptDto {
  @ApiProperty({ example: 'uuid-string' })
  @IsString()
  @IsNotEmpty()
  quiz_id: string;

  @ApiProperty({ example: 85, description: 'Score achieved in the quiz' })
  @IsNotEmpty()
  @Min(0)
  score: number;
}
