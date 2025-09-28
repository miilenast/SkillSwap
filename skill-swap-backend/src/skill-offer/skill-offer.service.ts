import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillOffer } from './entities/skill-offer.entity';
import { CreateSkillOfferDto } from './dto/create-skill-offer.dto';
import { UpdateSkillOfferDto } from './dto/update-skill-offer.dto';
import { User } from 'src/user/entities/user.entity';
import { SkillCategory } from 'src/enums/skill-category.enum';

@Injectable()
export class SkillOfferService {
  constructor(
    @InjectRepository(SkillOffer)
    private readonly skillOfferRepository: Repository<SkillOffer>,
  ) {}

  async create(
    createSkillOfferDto: CreateSkillOfferDto,
    user: User,
  ): Promise<SkillOffer> {
    const skillOffer = this.skillOfferRepository.create({
      ...createSkillOfferDto,
      user,
    });
    return this.skillOfferRepository.save(skillOffer);
  }

  findAll(): Promise<SkillOffer[]> {
    return this.skillOfferRepository.find();
  }

  async findOne(id: number): Promise<SkillOffer> {
    const skillOffer = await this.skillOfferRepository.findOne({
      where: { id },
    });
    if (!skillOffer) {
      throw new NotFoundException(`SkillOffer with id ${id} not found`);
    }
    return skillOffer;
  }

  async update(
    id: number,
    updateSkillOfferDto: UpdateSkillOfferDto,
  ): Promise<SkillOffer> {
    await this.skillOfferRepository.update(id, updateSkillOfferDto);
    const updatedSkillOffer = await this.findOne(id);
    return updatedSkillOffer;
  }

  async remove(id: number): Promise<void> {
    const result = await this.skillOfferRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`SkillOffer with id ${id} not found`);
    }
  }

  async findUsersBySkillCategory(category: SkillCategory): Promise<User[]> {
    const offers = await this.skillOfferRepository.find({
      where: { title: category },
      relations: ['user'],
    });
    const users = offers.map((offer) => offer.user);
    return users;
  }
}
