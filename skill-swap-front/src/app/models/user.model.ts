import { SkillOffer } from '../services/skill-offer/skill-offer';
import { Review } from './review.model';
import { Skill } from './skill.model';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePicture: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  
  offers?: Skill[];
  requests?: Request[];
  madeSwapOffers?: SkillOffer[];
  receivedReviews?: Review[];
}
