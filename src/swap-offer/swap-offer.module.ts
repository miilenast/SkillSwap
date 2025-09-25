import { Module } from '@nestjs/common';
import { SwapOfferService } from './swap-offer.service';
import { SwapOfferController } from './swap-offer.controller';
import { SwapOffer } from './entities/swap-offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SwapOffer])],
  exports: [TypeOrmModule],
  controllers: [SwapOfferController],
  providers: [SwapOfferService],
})
export class SwapOfferModule {}
