import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  providers: [GameGateway, GameService],
  imports: [PrismaModule, AchievementModule],
  controllers: [GameController]
})
export class GameModule {}
