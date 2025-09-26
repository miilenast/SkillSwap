import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillOfferDto } from './create-skill-offer.dto';
import { SkillOfferStatus } from 'src/enums/skill-offer-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateSkillOfferDto extends PartialType(CreateSkillOfferDto) {
  @IsNotEmpty()
  @IsEnum(SkillOfferStatus)
  status: SkillOfferStatus;
}
