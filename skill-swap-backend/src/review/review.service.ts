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

  async getRatingByReviewer(
    reviewerId: number,
    reviewedUserId: number,
  ): Promise<{ rating: number; reviewId?: number }> {
    const review = await this.reviewRepository.findOne({
      where: {
        reviewer: { id: reviewerId },
        reviewedUser: { id: reviewedUserId },
      },
      select: ['id', 'rating'],
    });

    if (review) {
      return { rating: review.rating, reviewId: review.id };
    }
    return { rating: 0, reviewId: 0 };
  }

  async getReviewsReceivedByUser(reviewedUserId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { reviewedUser: { id: reviewedUserId } },
      relations: ['reviewer'],
    });
  }

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
      rating: createReviewDto.rating,
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

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    currentUserId: number,
  ): Promise<Review> {
    const existingReview = await this.reviewRepository.findOne({
      where: { id },
      relations: ['reviewer'],
    });
    if (!existingReview) {
      throw new BadRequestException(`Review with id ${id} not found`);
    }

    if (existingReview.reviewer.id !== currentUserId) {
      throw new BadRequestException(`You can only update your own reviews`);
    }

    Object.assign(existingReview, updateReviewDto);
    return this.reviewRepository.save(existingReview);
  }

  async remove(id: number): Promise<void> {
    await this.reviewRepository.delete(id);
  }
}
