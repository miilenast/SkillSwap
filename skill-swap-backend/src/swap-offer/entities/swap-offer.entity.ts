/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { SkillOffer } from '../../skill-offer/entities/skill-offer.entity';
import { SkillRequest } from '../../skill-request/entities/skill-request.entity';
import { SwapOfferStatus } from '../../enums/swap-offer-status.enum';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class SwapOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SwapOfferStatus,
    default: SwapOfferStatus.PENDING,
  })
  status: SwapOfferStatus;

  @ManyToOne(() => User, (user) => user.madeSwapOffers)
  offerer: User;

  @ManyToOne(() => SkillOffer, (offeredSkill) => offeredSkill.swapOffers)
  offeredSkill: SkillOffer;

  @ManyToOne(() => SkillRequest, (requestedSkill) => requestedSkill.swapOffers)
  requestedSkill: SkillRequest;
}
