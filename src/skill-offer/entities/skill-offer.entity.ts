import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SwapOffer } from '../../swap-offer/entities/swap-offer.entity';

@Entity()
export class SkillOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'available' })
  status: string;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @OneToMany(() => SwapOffer, (swapOffer) => swapOffer.offeredSkill)
  swapOffers: SwapOffer[];
}
