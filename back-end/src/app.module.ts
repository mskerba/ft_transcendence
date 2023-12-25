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
import { AvatarModule } from './avatar/avatar.module';
import { BlockModule } from './block/block.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, FriendModule, ChatModule, AvatarModule, BlockModule],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },

  ],
})
export class AppModule {}
