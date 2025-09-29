import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillRequest } from './entities/skill-request.entity';
import { CreateSkillRequestDto } from './dto/create-skill-request.dto';
import { UpdateSkillRequestDto } from './dto/update-skill-request.dto';
import { User } from 'src/user/entities/user.entity';
import { SkillOfferService } from 'src/skill-offer/skill-offer.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SkillRequestService {
  constructor(
    @InjectRepository(SkillRequest)
    private skillRequestRepository: Repository<SkillRequest>,
    private skillOfferService: SkillOfferService,
    private userService: UserService,
  ) {}

  async create(
    createSkillRequestDto: CreateSkillRequestDto,
    user: User,
  ): Promise<SkillRequest> {
    const skillRequest = this.skillRequestRepository.create({
      ...createSkillRequestDto,
      user: user,
    });
    const savedRequest = await this.skillRequestRepository.save(skillRequest);

    void this.sendNotifications(savedRequest);

    return savedRequest;
  }

  private async sendNotifications(skillRequest: SkillRequest) {
    console.log(`Sending notifications for new request: ${skillRequest.title}`);

    const usersWithMatchingOffers =
      await this.skillOfferService.findUsersBySkillCategory(skillRequest.title);

    const nearbyUsers = this.userService.filterUsersByDistance(
      usersWithMatchingOffers,
      skillRequest.user,
      10,
    );

    for (const user of nearbyUsers) {
      console.log(
        `Sending notification to ${user.username} about new request: ${skillRequest.title}`,
      );
    }
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
    await this.skillRequestRepository.update(id, updateSkillRequestDto);
    const updatedSkillRequest = await this.findOne(id);
    return updatedSkillRequest;
  }

  async remove(id: number): Promise<void> {
    const result = await this.skillRequestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`SkillRequest with id ${id} not found`);
    }
  }

  async findByUser(userId: number): Promise<SkillRequest[]> {
    return this.skillRequestRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
      relations: ['user'],
    });
  }

  async getNearbyRequests(userId: number): Promise<SkillRequest[]> {
    const myCategories =
      await this.skillOfferService.findCategoriesByUser(userId);
    if (myCategories.length === 0) {
      return [];
    }

    const allRequests: SkillRequest[] = [];
    for (const category of myCategories) {
      const requests = await this.getNearbyRequestsByCategory(userId, category);
      allRequests.push(...requests);
    }
    return allRequests;
  }

  async getNearbyRequestsByCategory(
    userId: number,
    category: string,
  ): Promise<SkillRequest[]> {
    const user = await this.userService.findOne(userId);

    return this.skillRequestRepository
      .createQueryBuilder('skillRequest')
      .leftJoinAndSelect('skillRequest.user', 'user')
      .where('user.id != :userId', { userId })
      .andWhere('skillRequest.category = :category', { category })
      .andWhere(
        `6371 * acos(
          cos(radians(:lat)) * cos(radians(user.latitude)) * 
          cos(radians(user.longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(user.latitude))
        ) < 5`,
        { lat: user.latitude, lng: user.longitude },
      )
      .getMany();
  }
}
