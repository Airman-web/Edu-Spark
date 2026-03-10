import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterGuardianDto {
  @ApiProperty({ example: 'Alice Mukamana' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+250 788 123 456', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterStudentDto {
  @ApiProperty({ example: 'Uwimana Jean' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'jean_u' })
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'g1a2b3c4', description: 'The ID of the guardian' })
  @IsString()
  @IsNotEmpty()
  guardian_id: string;

  @ApiProperty({ example: 'gg-123', description: 'The ID of the grade group' })
  @IsString()
  @IsNotEmpty()
  grade_group_id: string;
}
