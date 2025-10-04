import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwapOffer } from './entities/swap-offer.entity';
import { CreateSwapOfferDto } from './dto/create-swap-offer.dto';
import { UpdateSwapOfferDto } from './dto/update-swap-offer.dto';
import { SkillOfferService } from 'src/skill-offer/skill-offer.service';
import { SkillRequestService } from 'src/skill-request/skill-request.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SwapOfferService {
  constructor(
    @InjectRepository(SwapOffer)
    private readonly swapOfferRepository: Repository<SwapOffer>,
    private skillOfferService: SkillOfferService,
    private skillRequestService: SkillRequestService,
  ) {}

  findAllOffersForRequest(requestId: number): Promise<SwapOffer[]> {
    console.log('Service method called with requestId:', requestId);
    return this.swapOfferRepository.find({
      where: { request: { id: requestId } },
      relations: ['offerer', 'offeredSkill', 'requestedSkill', 'request'],
    });
  }

  async findAllOffersByOffererId(offererId: number): Promise<SwapOffer[]> {
    console.log(offererId);
    return this.swapOfferRepository.find({
      where: { offerer: { id: offererId } },
      relations: [
        'offerer',
        'offeredSkill',
        'requestedSkill',
        'request',
        'request.user',
      ],
    });
  }

  async create(
    createSwapOfferDto: CreateSwapOfferDto,
    user: User,
  ): Promise<SwapOffer> {
    console.log(createSwapOfferDto);
    const offeredSkill = await this.skillOfferService.findOne(
      createSwapOfferDto.offeredSkillId,
    );
    console.log('Offered Skill:', offeredSkill);
    const requestedSkill = await this.skillOfferService.findOne(
      createSwapOfferDto.requestedSkillId,
    );
    const request = await this.skillRequestService.findOne(
      createSwapOfferDto.requestId,
    );
    console.log('Requested Skill:', requestedSkill);
    if (!offeredSkill || !requestedSkill || !request) {
      throw new NotFoundException('Offered or requested skill not found');
    }

    const swapOffer = this.swapOfferRepository.create({
      offerer: user,
      offeredSkill: offeredSkill,
      requestedSkill: requestedSkill,
      request: request,
    });
    return this.swapOfferRepository.save(swapOffer);
  }

  async findAll(): Promise<SwapOffer[]> {
    return this.swapOfferRepository.find({
      relations: ['offerer', 'offeredSkill', 'requestedSkill', 'request'],
    });
  }

  async findOne(id: number): Promise<SwapOffer> {
    const offer = await this.swapOfferRepository.findOne({
      where: { id },
      relations: ['offerer', 'offeredSkill', 'requestedSkill', 'request'],
    });
    if (!offer) {
      throw new NotFoundException(`SwapOffer with id ${id} not found`);
    }
    return offer;
  }

  async update(
    id: number,
    updateSwapOfferDto: UpdateSwapOfferDto,
  ): Promise<SwapOffer> {
    await this.swapOfferRepository.update(id, updateSwapOfferDto);
    const offer = await this.swapOfferRepository.findOne({
      where: { id },
      relations: ['offeredSkill', 'requestedSkill', 'offerer', 'request'],
    });
    if (!offer) {
      throw new NotFoundException(`SwapOffer with id ${id} not found`);
    }
    return offer;
  }

  async remove(id: number): Promise<void> {
    const result = await this.swapOfferRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`SwapOffer with id ${id} not found`);
    }
  }
}
