import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { SkillOffer } from '../../skill-offer/entities/skill-offer.entity';
import { SkillRequest } from '../../skill-request/entities/skill-request.entity';

@Entity()
export class SwapOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => SkillOffer, (offeredSkill) => offeredSkill.swapOffers)
  offeredSkill: SkillOffer;

  @ManyToOne(() => SkillRequest, (requestedSkill) => requestedSkill.swapOffers)
  requestedSkill: SkillRequest;
}
