import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface Game {
    player1Id: number;
    player2Id: number;

    player1Score: number;
    player2Score: number;
}


@Injectable()
export class GameService {

    constructor(private prisma: PrismaService) { }

    async games(userId: number) {
        return await this.prisma.game.findMany({
            where: {
                OR: [
                    { winnerId: userId },
                    { loserId: userId },
                ],
            },
            include: {
                winner: {
                    select: {
                        name: true,
                        avatar: true
                    },
                },
                loser: {
                    select: {
                        name: true,
                        avatar: true
                    },
                },
            },
            orderBy: {
                gameDate: 'desc',
            },
        });
    }

    async lastFiveGames(userId: number) {
        return await this.prisma.game.findMany({
            where: {
                OR: [
                    { winnerId: userId },
                    { loserId: userId },
                ],
            },
            orderBy: {
                gameDate: 'desc',
            },
            take: 5,
        });
    }

    async saveGame(game) {
        const data = {
            winnerId: (game.player1Score > game.player2Score ? game.player1Id : game.player2Id),
            loserId: (game.player1Score < game.player2Score ? game.player1Id : game.player2Id),
            winnerScore: (game.player1Score > game.player2Score ? game.player1Score : game.player2Score),
            loserScore: (game.player1Score < game.player2Score ? game.player1Score : game.player2Score),
        };

        const savedGame = await this.prisma.game.create({
            data,
        });

        const winner = await this.prisma.user.update({
            where: {
                userId: savedGame.winnerId,
            },
            data: {
                level: {
                    increment: 1,
                },
                games: {
                    increment: 1,
                },
                wins: {
                    increment: 1,
                },
            },
        });

        const loser = await this.prisma.user.update({
            where: {
                userId: savedGame.loserId,
            },
            data: {
                games: {
                    increment: 1,
                },
                losses: {
                    increment: 1,
                },
            },
        });
    }
}
