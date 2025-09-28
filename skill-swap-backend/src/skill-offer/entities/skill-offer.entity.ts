import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SwapOffer } from '../../swap-offer/entities/swap-offer.entity';
import { SkillOfferStatus } from 'src/enums/skill-offer-status.enum';
import { SkillCategory } from 'src/enums/skill-category.enum';

@Entity()
export class SkillOffer {
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
    enum: SkillOfferStatus,
    default: SkillOfferStatus.AVAILABLE,
  })
  status: SkillOfferStatus;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @OneToMany(() => SwapOffer, (swapOffer) => swapOffer.offeredSkill)
  swapOffers: SwapOffer[];
  offerer: any;
}
