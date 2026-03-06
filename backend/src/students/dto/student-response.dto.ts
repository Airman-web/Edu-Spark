import { ApiProperty } from '@nestjs/swagger';
import { GradeGroupDto } from '../../grade-groups/dto/grade-group.dto';

export class StudentResponseDto {
  @ApiProperty({ example: 's1-550e8400-e29b-41d4-a716-446655440000' })
  student_id: string;

  @ApiProperty({ example: 'g1-550e8400-e29b-41d4-a716-446655440000' })
  guardian_id: string;

  @ApiProperty({ example: 'Junior' })
  display_name: string;

  @ApiProperty({ example: 'gg1-550e8400-e29b-41d4-a716-446655440000' })
  grade_group_id: string;

  @ApiProperty({ type: GradeGroupDto })
  grade_group: GradeGroupDto;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;
}
