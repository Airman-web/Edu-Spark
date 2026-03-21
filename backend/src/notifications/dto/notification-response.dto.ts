import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty() notification_id: string;
  @ApiPropertyOptional() student_id?: string;
  @ApiPropertyOptional() guardian_id?: string;
  @ApiProperty() type: string;
  @ApiProperty() title: string;
  @ApiProperty() message: string;
  @ApiProperty() is_read: boolean;
  @ApiProperty() created_at: Date;
}
