import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillRequestDto } from './create-skill-request.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { SkillRequestStatus } from 'src/enums/skill-request-status.enum';

export class UpdateSkillRequestDto extends PartialType(CreateSkillRequestDto) {
  @IsOptional()
  @IsEnum(SkillRequestStatus)
  status: SkillRequestStatus;
}
