import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SkillOffer } from '../../skill-offer/entities/skill-offer.entity';
import { SkillRequest } from '../../skill-request/entities/skill-request.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @OneToMany(() => SkillOffer, (offer) => offer.user)
  offers: SkillOffer[];

  @OneToMany(() => SkillRequest, (request) => request.user)
  requests: SkillRequest[];
}
