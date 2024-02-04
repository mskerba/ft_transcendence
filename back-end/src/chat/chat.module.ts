import { Module } from '@nestjs/common';
import {ChatService} from './chat.service'
import { ChatController } from './chat.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatGateway } from './chat.gateway';
import { BlockModule } from 'src/block/block.module';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [PrismaModule, BlockModule, AchievementModule],
  exports: [ChatService],
})
export class ChatModule {}

