import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    reviewerId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const reviewedUser = await this.userRepository.findOne({
      where: { id: createReviewDto.reviewedUserId },
    });
    if (!reviewedUser) {
      throw new BadRequestException('Reviewed user not found');
    }

    const reviewer = await this.userRepository.findOneBy({ id: reviewerId });
    if (!reviewer) {
      throw new BadRequestException('Reviewer not found');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      reviewer,
      reviewedUser,
    });

    return this.reviewRepository.save(review);
  }

  findAll() {
    return this.reviewRepository.find();
  }

  findOne(id: number) {
    return this.reviewRepository.findOne({ where: { id } });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    await this.reviewRepository.update(id, updateReviewDto);
    const updatedReview = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!updatedReview) {
      throw new BadRequestException(`Review with id ${id} not found`);
    }
    return updatedReview;
  }

  async remove(id: number): Promise<void> {
    await this.reviewRepository.delete(id);
  }
}
