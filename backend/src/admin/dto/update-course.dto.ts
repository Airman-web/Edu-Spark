import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateCourseDto {
  @ApiPropertyOptional({
    example: 'Mathematics 102',
    description: 'Updated title of the course',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    example: 'An updated description of the course.',
    description: 'Updated description of the course',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'gg-456',
    description: 'Updated grade group ID for the course',
  })
  @IsString()
  @IsOptional()
  grade_group_id?: string;
}
