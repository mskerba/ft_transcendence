import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  imports: [PrismaModule],
})
export class LeaderboardModule {}
