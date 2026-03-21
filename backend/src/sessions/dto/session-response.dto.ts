import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty() session_id: string;
  @ApiProperty() student_id: string;
  @ApiProperty() started_at: Date;
  @ApiProperty() duration_seconds: number;
}

export class TotalTimeResponseDto {
  @ApiProperty() student_id: string;
  @ApiProperty() total_seconds: number;
}
