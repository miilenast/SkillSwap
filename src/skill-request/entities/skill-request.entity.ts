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
export class SkillRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => User, (user) => user.requests)
  user: User;

  @OneToMany(() => SwapOffer, (swapOffer) => swapOffer.requestedSkill)
  swapOffers: SwapOffer[];
}
