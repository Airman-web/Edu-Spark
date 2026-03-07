import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class QuizOptionDto {
  @ApiProperty({ example: 'Paris' })
  @IsString()
  @IsNotEmpty()
  option_text: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_correct: boolean;
}

class QuizQuestionDto {
  @ApiProperty({ example: 'What is the capital of France?' })
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @ApiProperty({ type: [QuizOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizOptionDto)
  options: QuizOptionDto[];
}

export class CreateQuizDto {
  @ApiProperty({
    example: 'l1-550e8400-e29b-41d4-a716-446655440000',
    description: 'The UUID of the lesson this quiz belongs to',
  })
  @IsString()
  @IsNotEmpty()
  lesson_id: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  total_points: number;

  @ApiProperty({ type: [QuizQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  questions: QuizQuestionDto[];
}
