import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly messageService: MessageService) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Povezan socket: ${socket.id}`);
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    payload: {
      senderId: number;
      receiverId: number;
      content: string;
    },
  ) {
    const message = await this.messageService.create(
      payload.senderId,
      payload.receiverId,
      payload.content,
    );

    this.server.emit('message', message);
  }
}
