import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user/:reviewedUserId')
  async getRatingForUser(
    @Param('reviewedUserId', ParseIntPipe) reviewedUserId: number,
    @Request() req: { user: User },
  ) {
    return this.reviewService.getRatingByReviewer(req.user.id, reviewedUserId);
  }

  @Get('received/:reviewedUserId')
  async getReceivedReviews(
    @Param('reviewedUserId', ParseIntPipe) reviewedUserId: number,
  ) {
    return this.reviewService.getReviewsReceivedByUser(reviewedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Request() req: { user: User },
  ) {
    return this.reviewService.create(req.user.id, createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':reviewId')
  update(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req: { user: User },
  ) {
    return this.reviewService.update(reviewId, updateReviewDto, +req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
