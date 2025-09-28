import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { SkillCategory } from '../../enums/skill-category.enum';

export class CreateSkillOfferDto {
  @IsNotEmpty()
  @IsEnum(SkillCategory)
  title: SkillCategory;

  @IsNotEmpty()
  @IsString()
  description: string;
}
