import { IsOptional, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSwapOfferDto } from './create-swap-offer.dto';
import { SwapOfferStatus } from '../../enums/swap-offer-status.enum';

export class UpdateSwapOfferDto extends PartialType(CreateSwapOfferDto) {
  @IsOptional()
  @IsEnum(SwapOfferStatus)
  status?: SwapOfferStatus;
}
