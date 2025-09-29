import { SwapOffer } from './swap-offer.model';
import { SkillCategory, SkillRequestStatus } from './enums.model';
import { User } from './user.model';

export interface SkillRequest {
  user: User;
  id: number;
  title: SkillCategory;
  description: string;
  status: SkillRequestStatus;
  userId?: number;
  swapOffers: SwapOffer[];
}
