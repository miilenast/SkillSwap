import { Skill } from './skill.model';
import { SkillRequest } from './request.model';
import { SwapOfferStatus } from './enums.model';
import { User } from './user.model';

export interface SwapOffer {
  request: any;
  id: number;
  status: SwapOfferStatus;
  offerer: User;
  offeredSkill: Skill;
  requestedSkill: SkillRequest;
}
