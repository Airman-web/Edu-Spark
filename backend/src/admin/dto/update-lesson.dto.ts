import { PartialType } from '@nestjs/swagger';
import { AdminCreateLessonDto } from './create-lesson.dto';

export class UpdateLessonDto extends PartialType(AdminCreateLessonDto) {}
