import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwapOffer } from './entities/swap-offer.entity';
import { CreateSwapOfferDto } from './dto/create-swap-offer.dto';
import { UpdateSwapOfferDto } from './dto/update-swap-offer.dto';

@Injectable()
export class SwapOfferService {
  constructor(
    @InjectRepository(SwapOffer)
    private readonly swapOfferRepository: Repository<SwapOffer>,
  ) {}

  create(createSwapOfferDto: CreateSwapOfferDto): Promise<SwapOffer> {
    const offer = this.swapOfferRepository.create(createSwapOfferDto);
    return this.swapOfferRepository.save(offer);
  }

  findAll(): Promise<SwapOffer[]> {
    return this.swapOfferRepository.find();
  }

  async findOne(id: number): Promise<SwapOffer> {
    const offer = await this.swapOfferRepository.findOneBy({ id });
    if (!offer) {
      throw new Error(`SwapOffer with id ${id} not found`);
    }
    return offer;
  }

  async update(
    id: number,
    updateSwapOfferDto: UpdateSwapOfferDto,
  ): Promise<SwapOffer> {
    await this.swapOfferRepository.update(id, updateSwapOfferDto);
    const offer = await this.swapOfferRepository.findOneBy({ id });
    if (!offer) {
      throw new Error(`SwapOffer with id ${id} not found`);
    }
    return offer;
  }

  async remove(id: number): Promise<void> {
    await this.swapOfferRepository.delete(id);
  }
}
