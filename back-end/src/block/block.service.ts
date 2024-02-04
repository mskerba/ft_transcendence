import { Injectable, ForbiddenException } from '@nestjs/common';
import { AchievementService } from 'src/achievement/achievement.service';
import { FriendService } from 'src/friend/friend.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlockService {
  constructor(
    private prisma: PrismaService,
    private friendService: FriendService,
    private achievementService: AchievementService,
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


    const blockedUsersData = blockedUsers?.map((block) => ({
      blockId: block.blockId,
      ...block.blockedUser,
    })) || [];
    return blockedUsersData;
  }

  async blockList(userId: number) {
    const _blockList = await this.prisma.block.findMany({
      where: {
        OR: [
          { userId: userId, },
          { blockedUserId: userId, },
        ],
      },
    });

    const filteredUserIds = _blockList.map((block) =>
      block.userId === userId ? block.blockedUserId : block.userId
    );
    return filteredUserIds;
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
    await this.achievementService.create(userId, 'Setting Boundaries 🚫', 'Block a user for the first time, ensuring a personalized and secure experience within the app.');

    const conversation = await this.prisma.linkDirectMessage.findFirst({
      where: {
        OR: [
          { UserId1: userId, UserId2: blockedUserId },
          { UserId1: blockedUserId, UserId2: userId },
        ]
      },
      select: {
        conversationId: true,
      },
    });

    if (conversation) {
      await this.prisma.directMessage.deleteMany({
        where: {
          privateId: conversation.conversationId,
        },
      });
      
      await this.prisma.linkDirectMessage.delete({
        where: {
          conversationId: conversation.conversationId,
        },
      });
    }

    await this.friendService.unfriend(userId, blockedUserId);
    const requestId = await this.friendService.FriendReqId(userId, blockedUserId);

    if (requestId !== '') await this.friendService.deleteReq(requestId);

    console.log('**********************');
    console.log(conversation);
    console.log('**********************');
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
