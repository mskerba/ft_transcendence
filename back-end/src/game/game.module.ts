import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  providers: [GameGateway, GameService],
  imports: [PrismaModule],
  controllers: [GameController]
})
export class GameModule {}
