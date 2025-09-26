import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSwapOfferDto {
  @IsNotEmpty()
  @IsNumber()
  offeredSkillId: number;

  @IsNotEmpty()
  @IsNumber()
  requestedSkillId: number;
}
