import { PartialType } from '@nestjs/swagger';
import { CreateGradeGroupDto } from './create-grade-group.dto';

export class UpdateGradeGroupDto extends PartialType(CreateGradeGroupDto) {}
