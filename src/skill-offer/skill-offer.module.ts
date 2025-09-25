import { Module } from '@nestjs/common';
import { SkillOfferService } from './skill-offer.service';
import { SkillOfferController } from './skill-offer.controller';
import { SkillOffer } from './entities/skill-offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SkillOffer])],
  exports: [TypeOrmModule],
  controllers: [SkillOfferController],
  providers: [SkillOfferService],
})
export class SkillOfferModule {}
