import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsInt()
  @IsNotEmpty()
  reviewedUserId: number;
}
