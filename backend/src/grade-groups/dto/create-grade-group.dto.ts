import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeGroupDto {
  @ApiProperty({ example: 'P1', description: 'The name of the grade group (e.g., P1, P2, P3)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Primary 1', description: 'A brief description of the grade group', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
