import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chatGateway/chat.gateway';
import { ChatService } from './chat/chat.service';


@Module({
  imports: [AuthModule, PrismaModule, UserModule, FriendModule, ChatModule],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    ChatGateway,
    ChatService,

  ],
})
export class AppModule {}
