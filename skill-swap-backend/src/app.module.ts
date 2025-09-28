/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkillOfferModule } from './skill-offer/skill-offer.module';
import { UserModule } from './user/user.module';
import { SkillRequestModule } from './skill-request/skill-request.module';
import { SwapOfferModule } from './swap-offer/swap-offer.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'milena',
      password: 'hobotnica',
      database: 'skillswap',
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    SkillRequestModule,
    SkillOfferModule,
    SwapOfferModule,
    AuthModule,
    ReviewModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
