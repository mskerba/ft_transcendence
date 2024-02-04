import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementService } from 'src/achievement/achievement.service';

@Injectable()
export class FriendService {

  constructor(
    private prisma: PrismaService,
    private achievementService: AchievementService,
  ) { }

  async sendFriendReq(senderId: number, receiverId: number) {

    const status = await this.friendshipStatus(senderId, receiverId);
    if (status !== 'not-friend') return;
    return await this.prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
      }
    });
  }


  async acceptFriendReq(requestId: string, userId: number) {
    const request = await this.prisma.friendRequest.findUnique({
      where: {
        requestId
      }
    });

    if (!request) return ;
    if (request.receiverId !== userId) {
      throw new ForbiddenException();
    }
    await this.deleteReq(requestId);
    await this.addFriend(request.senderId, request.receiverId);
    await this.achievementService.create(request.senderId, 'Founding Bonds 🤝', 'Forge your first friendship in the gaming community, creating lasting connections on the virtual battlefield.');
    await this.achievementService.create(request.receiverId, 'Founding Bonds 🤝', 'Forge your first friendship in the gaming community, creating lasting connections on the virtual battlefield.');
  }

  async unfriend(userId: number, friendId: number) {

    const friendReqs = await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId },
          { user1Id: friendId, user2Id: userId },
        ],
      },
    });

    if (!friendReqs.count) return ;
    await this.changeFriendCount(userId, -1);
    await this.changeFriendCount(friendId, -1);
  }

  async declineFriendReq(requestId: string, userId: number) {
    const request = await this.prisma.friendRequest.findUnique({
      where: {
        requestId
      }
    });

    if (!request) return ;
    if (request.receiverId !== userId) {
      throw new ForbiddenException();
    }

    await this.deleteReq(requestId);
  }

  async cancelFriendReq(requestId: string, userId: number) {
    const request = await this.prisma.friendRequest.findUnique({
      where: {
        requestId
      }
    });

    if (!request) return ;
    if (request.senderId !== userId) {
      throw new ForbiddenException();
    }

    await this.deleteReq(requestId);
  }

  async FriendReqId(user1Id: number, user2Id: number) {
    const friendReq = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ],
      },
    });

    return (friendReq ) ? friendReq.requestId : '';
  }

  async friends(userId: number) {
    const userFriends = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        user1Friends: {
          select: {
            user2: {
              select: {
                userId: true,
                name: true,
                avatar: true,
              }
            },
          },
        },
        user2Friends: {
          select: {
            user1: {
              select: {
                userId: true,
                name: true,
                avatar: true,
              }
            },
          },
        },
      },
    });

    const allFriends = [
      ...(userFriends?.user1Friends?.map((friendship) => friendship.user2) || []),
      ...(userFriends?.user2Friends?.map((friendship) => friendship.user1) || []),
    ];

    return allFriends;
  }


  async friendReqs(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        receivedFriendRequests: {
          select: {
            requestId: true,
            sender: {
              select: {
                userId: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }


  // friend  | request-sent | request-received | not-friend
  async friendshipStatus(user1Id: number, user2Id: number) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });

    if (friendship) return 'friend';

    const friendReq = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ],
      },
    });

    if (friendReq) {
      return (friendReq.senderId === user1Id) ? 'request-sent' : 'request-received';
    }

    return 'not-friend';
  }

  async deleteReq(requestId: string) {
    return await this.prisma.friendRequest.delete({
      where: {
        requestId
      }
    });
  }

  async addFriend(user1Id: number, user2Id: number) {
    await this.prisma.friendship.create({
      data: {
        user1Id,
        user2Id,
      }
    });
    await this.changeFriendCount(user1Id, 1);
    await this.changeFriendCount(user2Id, 1);
  }

  async changeFriendCount(userId: number, amount: number) {
    await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        friends: {
          increment: amount,
        },
      },
    });
  }
}
