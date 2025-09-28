import { Module, forwardRef } from '@nestjs/common';
import { SkillOfferModule } from '../skill-offer/skill-offer.module';
import { SkillRequestModule } from '../skill-request/skill-request.module';
import { SwapOfferModule } from '../swap-offer/swap-offer.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => SkillOfferModule),
    forwardRef(() => SkillRequestModule),
    forwardRef(() => SwapOfferModule),
    forwardRef(() => AuthModule),
    StorageModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
