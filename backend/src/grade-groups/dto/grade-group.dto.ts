import { ApiProperty } from '@nestjs/swagger';

export class GradeGroupDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'The unique identifier of the grade group',
  })
  grade_group_id: string;

  @ApiProperty({ example: 'P1', description: 'The name of the grade group' })
  name: string;

  @ApiProperty({
    example: 'Primary 1',
    description: 'A brief description of the grade group',
    required: false,
  })
  description?: string;
}
