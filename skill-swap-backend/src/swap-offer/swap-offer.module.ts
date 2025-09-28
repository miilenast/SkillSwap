import { forwardRef, Module } from '@nestjs/common';
import { SwapOfferService } from './swap-offer.service';
import { SwapOfferController } from './swap-offer.controller';
import { SwapOffer } from './entities/swap-offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillOfferModule } from 'src/skill-offer/skill-offer.module';
import { SkillRequestModule } from 'src/skill-request/skill-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SwapOffer]),
    forwardRef(() => SkillOfferModule),
    forwardRef(() => SkillRequestModule),
  ],
  controllers: [SwapOfferController],
  providers: [SwapOfferService],
  exports: [SwapOfferService],
})
export class SwapOfferModule {}
