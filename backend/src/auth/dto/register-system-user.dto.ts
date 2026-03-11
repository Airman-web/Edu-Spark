import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterSystemUserDto {
  @ApiProperty({ example: 'system.admin@axk.org' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SuperSecurePass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'System Administrator' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'my-super-secret-key' })
  @IsString()
  @IsNotEmpty()
  registrationSecret: string;
}
