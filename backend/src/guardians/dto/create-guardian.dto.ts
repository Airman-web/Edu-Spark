import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuardianDto {
  @ApiProperty({ example: 'John Doe', description: 'The full name of the guardian' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email address of the guardian' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123-456-7890', description: 'The optional phone number of the guardian' })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: 'password123', description: 'A secure password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
