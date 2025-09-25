import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillRequest } from './entities/skill-request.entity';
import { CreateSkillRequestDto } from './dto/create-skill-request.dto';
import { UpdateSkillRequestDto } from './dto/update-skill-request.dto';

@Injectable()
export class SkillRequestService {
  constructor(
    @InjectRepository(SkillRequest)
    private readonly skillRequestRepository: Repository<SkillRequest>,
  ) {}

  create(createSkillRequestDto: CreateSkillRequestDto): Promise<SkillRequest> {
    const skillRequest = this.skillRequestRepository.create(
      createSkillRequestDto,
    );
    return this.skillRequestRepository.save(skillRequest);
  }

  findAll(): Promise<SkillRequest[]> {
    return this.skillRequestRepository.find();
  }

  async findOne(id: number): Promise<SkillRequest> {
    const skillRequest = await this.skillRequestRepository.findOneBy({ id });
    if (!skillRequest) {
      throw new NotFoundException(`SkillRequest with id ${id} not found`);
    }
    return skillRequest;
  }

  async update(
    id: number,
    updateSkillRequestDto: UpdateSkillRequestDto,
  ): Promise<SkillRequest> {
    const skillRequest = await this.skillRequestRepository.preload({
      id,
      ...updateSkillRequestDto,
    });

    if (!skillRequest) {
      throw new NotFoundException(`SkillRequest with id ${id} not found`);
    }

    return this.skillRequestRepository.save(skillRequest);
  }

  async remove(id: number): Promise<void> {
    const result = await this.skillRequestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`SkillRequest with id ${id} not found`);
    }
  }
}
