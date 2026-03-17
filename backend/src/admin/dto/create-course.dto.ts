import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class AdminCreateCourseDto {
  @ApiProperty({
    example: 'gg-123',
    description: 'The ID of the grade group this course belongs to',
  })
  @IsString()
  @IsNotEmpty()
  grade_group_id: string;

  @ApiProperty({
    example: 'Mathematics 101',
    description: 'The title of the course',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'An introduction to basic arithmetic and geometry.',
    description: 'A brief description of the course content',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
