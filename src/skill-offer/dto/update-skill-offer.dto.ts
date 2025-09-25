import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillOfferDto } from './create-skill-offer.dto';

export class UpdateSkillOfferDto extends PartialType(CreateSkillOfferDto) {}
