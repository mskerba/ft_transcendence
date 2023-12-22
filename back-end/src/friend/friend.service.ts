import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {

  constructor(private prisma: PrismaService) { }

  async sendFriendReq(senderId: number, receiverId: number) {
    await this.prisma.friendRequest.create({
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

    if (request.receiverId !== userId) {
      throw new ForbiddenException();
    }
    await this.deleteReq(requestId);
    return await this.addFriend(request.senderId, request.receiverId);
  }

  async unfriend(userId: number, friendId: number) {
    await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId },
          { user1Id: friendId, user2Id: userId },
        ],
      },
    });
  }

  async declineFriendReq(requestId: string, userId: number) {
    const request = await this.prisma.friendRequest.findUnique({
      where: {
        requestId
      }
    });

    if (request.receiverId !== userId) {
      throw new ForbiddenException();
    }
  
    await this.deleteReq(requestId);
  }

  async friends(userId: number) {
    const userFriends = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        user1Friends: {
          select: {
            user2: true,
          },
        },
        user2Friends: {
          select: {
            user1: true,
          },
        },
      },
    });
  }


  async friendReqs(userId: number) {
    const userFriends = await this.prisma.user.findUnique({
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
              },
            },
            requestDate: true,
          },
        },
      },
    });
  }


  // friend  | request-sent | request-received | not-friend
  friendshipStatus(id: number) {
  }

  async deleteReq(requestId: string) {
    return await this.prisma.friendRequest.delete({
      where: {
        requestId
      }
    });
  }

  async addFriend(user1Id: number, user2Id: number)
  {
    await this.prisma.friendship.create({
      data: {
        user1Id,
        user2Id,
      }
    });
  }
}
