import { Test, TestingModule } from '@nestjs/testing';
import { SkillRequestController } from './skill-request.controller';
import { SkillRequestService } from './skill-request.service';

describe('SkillRequestController', () => {
  let controller: SkillRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillRequestController],
      providers: [SkillRequestService],
    }).compile();

    controller = module.get<SkillRequestController>(SkillRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
