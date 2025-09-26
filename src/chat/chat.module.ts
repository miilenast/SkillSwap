import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { MessageService } from '../message/message.service';
import { Message } from '../message/entities/message.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  providers: [ChatGateway, MessageService],
})
export class ChatModule {}
