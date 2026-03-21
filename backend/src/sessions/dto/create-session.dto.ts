import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ description: 'Duration of the session in seconds', example: 300 })
  @IsInt()
  @Min(1)
  duration_seconds: number;
}
