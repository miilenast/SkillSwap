import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillOffer } from './entities/skill-offer.entity';
import { CreateSkillOfferDto } from './dto/create-skill-offer.dto';
import { UpdateSkillOfferDto } from './dto/update-skill-offer.dto';

@Injectable()
export class SkillOfferService {
  constructor(
    @InjectRepository(SkillOffer)
    private readonly skillOfferRepository: Repository<SkillOffer>,
  ) {}

  create(createSkillOfferDto: CreateSkillOfferDto): Promise<SkillOffer> {
    const skillOffer = this.skillOfferRepository.create(createSkillOfferDto);
    return this.skillOfferRepository.save(skillOffer);
  }

  findAll(): Promise<SkillOffer[]> {
    return this.skillOfferRepository.find();
  }

  async findOne(id: number): Promise<SkillOffer> {
    const skillOffer = await this.skillOfferRepository.findOneBy({ id });
    if (!skillOffer) {
      throw new NotFoundException(`SkillOffer with id ${id} not found`);
    }
    return skillOffer;
  }

  async update(
    id: number,
    updateSkillOfferDto: UpdateSkillOfferDto,
  ): Promise<SkillOffer> {
    const skillOffer = await this.skillOfferRepository.preload({
      id,
      ...updateSkillOfferDto,
    });

    if (!skillOffer) {
      throw new NotFoundException(`SkillOffer with id ${id} not found`);
    }

    return this.skillOfferRepository.save(skillOffer);
  }

  async remove(id: number): Promise<void> {
    const result = await this.skillOfferRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`SkillOffer with id ${id} not found`);
    }
  }
}
