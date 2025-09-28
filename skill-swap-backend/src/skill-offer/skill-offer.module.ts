import { forwardRef, Module } from '@nestjs/common';
import { SkillOfferService } from './skill-offer.service';
import { SkillOfferController } from './skill-offer.controller';
import { SkillOffer } from './entities/skill-offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { SkillRequestModule } from 'src/skill-request/skill-request.module';
import { SwapOfferModule } from 'src/swap-offer/swap-offer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkillOffer]),
    UserModule,
    forwardRef(() => SkillRequestModule),
    forwardRef(() => SwapOfferModule),
  ],
  controllers: [SkillOfferController],
  providers: [SkillOfferService],
  exports: [SkillOfferService],
})
export class SkillOfferModule {}
