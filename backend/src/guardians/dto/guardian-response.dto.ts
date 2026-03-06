import { ApiProperty } from '@nestjs/swagger';

export class GuardianResponseDto {
  @ApiProperty({ example: 'g1-550e8400-e29b-41d4-a716-446655440000' })
  guardian_id: string;

  @ApiProperty({ example: 'John Doe' })
  full_name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: '123-456-7890', required: false })
  phone_number?: string;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;
}
