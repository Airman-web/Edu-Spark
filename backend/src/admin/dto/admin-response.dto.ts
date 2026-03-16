import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ example: 340 })
  totalStudents: number;

  @ApiProperty({ example: 120 })
  totalGuardians: number;

  @ApiProperty({ example: 18 })
  totalCourses: number;

  @ApiProperty({ example: 275 })
  activeStudents: number;
}

export class CourseSummaryDto {
  @ApiProperty({ example: 'c1a2b3c4' })
  course_id: string;

  @ApiProperty({ example: 'Mathematics 101' })
  title: string;

  @ApiProperty({ example: 'Basic arithmetic' })
  description: string;
}

class GradeGroupDto {
  @ApiProperty({ example: 'p1' })
  grade_group_id: string;

  @ApiProperty({ example: 'Primary 1' })
  name: string;
}

class GuardianSummaryDto {
  @ApiProperty({ example: 'Alice Mukamana' })
  full_name: string;

  @ApiProperty({ example: 'alice@example.com' })
  email: string;
}

export class AdminStudentResponseDto {
  @ApiProperty({ example: 's1a2b3c4' })
  student_id: string;

  @ApiProperty({ example: 'Uwimana Jean' })
  full_name: string;

  @ApiProperty({ example: 'p1' })
  grade_group_id: string;

  @ApiProperty({ type: GradeGroupDto })
  grade_group: GradeGroupDto;

  @ApiProperty({ type: GuardianSummaryDto })
  guardian: GuardianSummaryDto;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;
}

class GuardianCountDto {
  @ApiProperty({ example: 2 })
  students: number;
}

export class AdminGuardianResponseDto {
  @ApiProperty({ example: 'g1a2b3c4' })
  guardian_id: string;

  @ApiProperty({ example: 'Alice Mukamana' })
  full_name: string;

  @ApiProperty({ example: 'alice@example.com' })
  email: string;

  @ApiProperty({ example: '+250 788 123 456' })
  phone_number: string;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ type: GuardianCountDto })
  _count: GuardianCountDto;
}

class CourseCountDto {
  @ApiProperty({ example: 12 })
  lessons: number;
}

export class AdminCourseResponseDto {
  @ApiProperty({ example: 'c1a2b3c4' })
  course_id: string;

  @ApiProperty({ example: 'Mathematics 101' })
  title: string;

  @ApiProperty({ example: 'Basic arithmetic' })
  description: string;

  @ApiProperty({ type: GradeGroupDto })
  grade_group: GradeGroupDto;

  @ApiProperty({ type: CourseCountDto })
  _count: CourseCountDto;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;
}

export class AdminLessonResponseDto {
  @ApiProperty({ example: 'l1a2b3c4' })
  lesson_id: string;

  @ApiProperty({ example: 'c1a2b3c4' })
  course_id: string;

  @ApiProperty({ example: 'Introduction to Numbers' })
  title: string;

  @ApiProperty({ example: 'video' })
  content_type: string;

  @ApiProperty({ example: 'https://youtube.com/...' })
  content: string;

  @ApiProperty({ example: 10 })
  points_reward: number;

  @ApiProperty({ example: '2026-03-05T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ type: CourseSummaryDto })
  course: CourseSummaryDto;
}
