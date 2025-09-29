import { User } from './user.model';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewer: User;
  reviewedUser: User;
}
