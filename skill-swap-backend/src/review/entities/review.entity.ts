import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => User, (user) => user.givenReviews)
  reviewer: User;

  @ManyToOne(() => User, (user) => user.receivedReviews)
  reviewedUser: User;
}
