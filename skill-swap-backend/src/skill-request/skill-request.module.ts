import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillRequestService } from './skill-request.service';
import { SkillRequestController } from './skill-request.controller';
import { SkillRequest } from './entities/skill-request.entity';
import { SkillOfferModule } from 'src/skill-offer/skill-offer.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkillRequest]),
    forwardRef(() => SkillOfferModule),
    forwardRef(() => UserModule),
  ],
  controllers: [SkillRequestController],
  providers: [SkillRequestService],
  exports: [SkillRequestService],
})
export class SkillRequestModule {}
