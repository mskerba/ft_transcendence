import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    async search(keyword: string) {
        const users = await this.prisma.user.findMany({
            where: {
                name: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
            select: {
                userId: true,
                name: true,
                avatar: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        const rooms = await this.prisma.room.findMany({
            where: {
                TypeRoom: {
                    not: 'private',
                },
                title: {
                    contains: keyword,
                    mode: "insensitive",
                }
            },
            select: {
                RoomId: true,
                TypeRoom: true,
                avatar: true,
                title: true,
            },
            orderBy: {
                title: 'asc',
            },
        });

        return [...users, ...rooms];
    }
}
