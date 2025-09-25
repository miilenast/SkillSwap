import { PartialType } from '@nestjs/mapped-types';
import { CreateSwapOfferDto } from './create-swap-offer.dto';

export class UpdateSwapOfferDto extends PartialType(CreateSwapOfferDto) {}
