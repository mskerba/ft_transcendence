import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { ChatModule } from './chat/chat.module';
import { AvatarModule } from './avatar/avatar.module';
import { BlockModule } from './block/block.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { GameModule } from './game/game.module';
import { SearchModule } from './search/search.module';


@Module({
  imports: [AuthModule, PrismaModule, UserModule, FriendModule, ChatModule, AvatarModule, BlockModule, LeaderboardModule, GameModule, SearchModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,  
    }

  ],
})
export class AppModule {}