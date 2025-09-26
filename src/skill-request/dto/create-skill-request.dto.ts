import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { SkillCategory } from '../../enums/skill-category.enum';

export class CreateSkillRequestDto {
  @IsNotEmpty()
  @IsEnum(SkillCategory)
  title: SkillCategory;

  @IsNotEmpty()
  @IsString()
  description: string;
}
