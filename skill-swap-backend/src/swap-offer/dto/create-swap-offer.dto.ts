import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSwapOfferDto {
  @IsNotEmpty()
  @IsNumber()
  requestId: number;

  @IsNotEmpty()
  @IsNumber()
  offeredSkillId: number;

  @IsNotEmpty()
  @IsNumber()
  requestedSkillId: number;
}
