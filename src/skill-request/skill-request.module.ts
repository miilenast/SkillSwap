import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillRequestService } from './skill-request.service';
import { SkillRequestController } from './skill-request.controller';
import { SkillRequest } from './entities/skill-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SkillRequest])],
  exports: [TypeOrmModule],
  controllers: [SkillRequestController],
  providers: [SkillRequestService],
})
export class SkillRequestModule {}
