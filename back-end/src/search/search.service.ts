import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    async search(keyword: string) {
        console.log(keyword)
        const users = await this.prisma.user.findMany({
            where: {
                name: {
                    contains: keyword,
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

        console.log('users', users);
        console.log('rooms', rooms);

        return [...users, ...rooms];
    }
}
