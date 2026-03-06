import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudentLoginDto {
  @ApiProperty({ example: 'Junior', description: 'The student\'s display name (username)' })
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @ApiProperty({ example: 'password123', description: 'The student\'s password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
