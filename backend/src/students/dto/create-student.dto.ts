import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({
    example: 'uuid-of-p1-group',
    description: 'The UUID of the grade group',
  })
  @IsString()
  @IsNotEmpty()
  grade_group_id: string;

  @ApiProperty({
    example: 'Junior Doe',
    description: 'The full name of the student',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    example: 'Junior',
    description: 'A shorter name for display purposes',
  })
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @ApiProperty({
    example: '2010-05-15',
    description: "The student's date of birth (YYYY-MM-DD)",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date_of_birth?: string;

  @ApiProperty({
    example: 'None',
    description: 'Any disability information for personalized learning',
    required: false,
  })
  @IsString()
  @IsOptional()
  disability_info?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Student login password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: "URL to the student's profile image",
    required: false,
  })
  @IsString()
  @IsOptional()
  profile_image_url?: string;
}
