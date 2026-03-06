import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDto {
  @ApiProperty({ example: 'g1-550e8400-e29b-41d4-a716-446655440000' })
  sub: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'guardian' })
  role: string;
}

export class StudentUserSummaryDto {
  @ApiProperty({ example: 's1-550e8400-e29b-41d4-a716-446655440000' })
  sub: string;

  @ApiProperty({ example: 's1-550e8400-e29b-41d4-a716-446655440000' })
  student_id: string;

  @ApiProperty({ example: 'student' })
  role: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ type: UserSummaryDto })
  user: UserSummaryDto;
}

export class StudentLoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ type: StudentUserSummaryDto })
  user: StudentUserSummaryDto;
}
