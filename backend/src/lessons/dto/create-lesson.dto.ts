import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({
    example: 'c1-550e8400-e29b-41d4-a716-446655440000',
    description: 'The UUID of the course this lesson belongs to',
  })
  @IsString()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({ example: 'Counting to 10' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'video', enum: ['video', 'reading'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['video', 'reading'])
  content_type: string;

  @ApiProperty({ example: 'https://youtube.com/...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  points_reward: number;
}
