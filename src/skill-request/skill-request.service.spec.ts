import { Test, TestingModule } from '@nestjs/testing';
import { SkillRequestService } from './skill-request.service';

describe('SkillRequestService', () => {
  let service: SkillRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillRequestService],
    }).compile();

    service = module.get<SkillRequestService>(SkillRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
