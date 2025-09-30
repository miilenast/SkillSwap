import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SwapOffer } from '../../swap-offer/entities/swap-offer.entity';
import { SkillCategory } from '../../enums/skill-category.enum';
import { SkillRequestStatus } from '../../enums/skill-request-status.enum';

@Entity()
export class SkillRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SkillCategory,
    default: SkillCategory.OTHER,
  })
  title: SkillCategory;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: SkillRequestStatus,
    default: SkillRequestStatus.PENDING,
  })
  status: SkillRequestStatus;

  @ManyToOne(() => User, (user) => user.requests)
  user: User;

  @OneToMany(() => SwapOffer, (swapOffer) => swapOffer.requestedSkill)
  swapOffers: SwapOffer[];
}
