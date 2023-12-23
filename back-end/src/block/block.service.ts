import { Injectable, ForbiddenException } from '@nestjs/common';
import { FriendService } from 'src/friend/friend.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlockService {
    constructor(
        private prisma: PrismaService,
        private friendService: FriendService,
    ) { }

    async blockedUsers(blockerId: number) {
        const blockedUsers = await this.prisma.user
        .findUnique({
          where: { userId: blockerId },
        })
        .blockingUsers({
          select: {
            blockId: true,
            blockedUser: {
              select: {
                userId: true,
                name: true,
                avatar: true,
              },
            },
          },
        });
  
      // Extract relevant data
      const blockedUsersData = blockedUsers?.map((block) => ({
        blockId: block.blockId,
        ...block.blockedUser,
      })) || [];
      return blockedUsersData;
    }

    async block(userId: number, blockedUserId: number) {
        const block = await this.prisma.block.findFirst({
            where: {
                userId: blockedUserId,
                blockedUserId: userId,
            }
        });

        if (block) throw new ForbiddenException();
        await this.prisma.block.create({
            data: {
                userId,
                blockedUserId,
            }
        });

        await this.friendService.unfriend(userId, blockedUserId);
        const requestId = await this.friendService.FriendReqId(userId, blockedUserId);

        if (requestId !== '') await this.friendService.deleteReq(requestId);
    }

    async unblock(blockId: string, userId: number) {
        const block = await this.prisma.block.findUnique({ where: { blockId } });

        if (!block || block.userId !== userId) throw new ForbiddenException();
        return await this.prisma.block.delete({
            where: {
                blockId
            },
        });
    }
}
