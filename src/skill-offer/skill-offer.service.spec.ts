import { Test, TestingModule } from '@nestjs/testing';
import { SkillOfferService } from './skill-offer.service';

describe('SkillOfferService', () => {
  let service: SkillOfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillOfferService],
    }).compile();

    service = module.get<SkillOfferService>(SkillOfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
