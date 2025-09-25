import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkillOfferModule } from './skill-offer/skill-offer.module';
import { UserModule } from './user/user.module';
import { SkillRequestModule } from './skill-request/skill-request.module';
import { SwapOfferModule } from './swap-offer/swap-offer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'milena',
      password: 'hobotnica',
      database: 'skillswap',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    SkillRequestModule,
    SkillOfferModule,
    SwapOfferModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
