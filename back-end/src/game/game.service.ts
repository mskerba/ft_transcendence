import { Injectable } from '@nestjs/common';
import { AchievementService } from 'src/achievement/achievement.service';
import { PrismaService } from 'src/prisma/prisma.service';

interface Game {
    player1Id: number;
    player2Id: number;

    player1Score: number;
    player2Score: number;
}


@Injectable()
export class GameService {

    constructor(
        private prisma: PrismaService,
        private achievementService: AchievementService,
        ) { }

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
        try {
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

        if (winner.wins >= 25) {
            await this.achievementService.create(winner.userId, 'Champion\'s Odyssey 🏅', 'Reach the pinnacle with 25 wins, proving yourself as an indomitable force in the competitive realm.');
        }
        else if (winner.wins >= 10) {
            await this.achievementService.create(winner.userId, 'Mastering the Battlefield 🥇', 'Achieve a milestone with 10 victories, showcasing your strategic prowess and gaming expertise.');
        }
        else if (winner.wins >= 5) {
            await this.achievementService.create(winner.userId, 'Victorious Beginnings 🏆', 'Win 5 matches and pave the way for your triumph in the gaming arena.');
        }

        if (savedGame.loserScore === 0) {
            await this.achievementService.create(winner.userId, 'Immaculate Conqueror 🛡️', 'Achieve victory with a cleansheet, demonstrating not only your offensive prowess but also impeccable defensive skills.');
        }
    } catch (error) {}

    }
}
