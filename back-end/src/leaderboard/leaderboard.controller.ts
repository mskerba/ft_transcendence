import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { GetCurrentUser } from 'src/common/decorators';

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) { }

    @Get()
    async leaderboard() {
        return await this.leaderboardService.leaderboard();
    }

}
