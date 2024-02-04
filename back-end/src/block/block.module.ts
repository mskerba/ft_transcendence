import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendModule } from 'src/friend/friend.module';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  controllers: [BlockController],
  providers: [BlockService],
  imports: [PrismaModule, FriendModule, AchievementModule],
  exports: [BlockService]
})
export class BlockModule {}
