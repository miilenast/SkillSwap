import { Test, TestingModule } from '@nestjs/testing';
import { SwapOfferController } from './swap-offer.controller';
import { SwapOfferService } from './swap-offer.service';

describe('SwapOfferController', () => {
  let controller: SwapOfferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwapOfferController],
      providers: [SwapOfferService],
    }).compile();

    controller = module.get<SwapOfferController>(SwapOfferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
