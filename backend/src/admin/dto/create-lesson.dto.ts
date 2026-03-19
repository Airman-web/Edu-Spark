import { IsNotEmpty, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminCreateLessonDto {
  @ApiProperty({
    example: 'c1a2b3c4',
    description: 'The ID of the course this lesson belongs to',
  })
  @IsString()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({ example: 'Introduction to Numbers' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'video', enum: ['video', 'reading'] })
  @IsEnum(['video', 'reading'])
  @IsNotEmpty()
  content_type: string;

  @ApiProperty({ example: 'https://youtube.com/...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  points_reward: number;
}
