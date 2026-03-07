import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    example: 'gg1-550e8400-e29b-41d4-a716-446655440000',
    description: 'The UUID of the grade group',
  })
  @IsString()
  @IsNotEmpty()
  grade_group_id: string;

  @ApiProperty({ example: 'Mathematics 101' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Basic arithmetic and geometry', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
