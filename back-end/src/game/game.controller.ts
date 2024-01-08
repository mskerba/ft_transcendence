import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Get(':userId')
    async games(@Param('userId', ParseIntPipe) userId: number) {
        return await this.gameService.games(userId);
    }


    @Get('/last-5/:userId')
    async lastFiveGames(@Param('userId', ParseIntPipe) userId: number) {
        return await this.gameService.lastFiveGames(userId);
    }
}
