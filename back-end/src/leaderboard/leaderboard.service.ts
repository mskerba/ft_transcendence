import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeaderboardService {
    constructor(private prisma: PrismaService) { }

    async leaderboard() {
        return await this.prisma.user.findMany({
            orderBy: {
                level: 'desc',
            },
            select: {
                userId: true,
                name: true,
                avatar: true,
                level: true,
                games: true,
                wins: true,
                losses: true
            },
        });

    }
}
