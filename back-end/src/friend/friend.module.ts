import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  controllers: [FriendController],
  providers: [FriendService],
  imports: [PrismaModule, AchievementModule],
  exports: [FriendService],
})
export class FriendModule {}
