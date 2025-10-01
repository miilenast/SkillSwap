import { User } from './user.model';

export interface Review {
  id: number;
  rating: number;
  reviewer: User;
  reviewedUser: User;
}
