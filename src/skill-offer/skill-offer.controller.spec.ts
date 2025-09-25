import { Test, TestingModule } from '@nestjs/testing';
import { SkillOfferController } from './skill-offer.controller';
import { SkillOfferService } from './skill-offer.service';

describe('SkillOfferController', () => {
  let controller: SkillOfferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillOfferController],
      providers: [SkillOfferService],
    }).compile();

    controller = module.get<SkillOfferController>(SkillOfferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
