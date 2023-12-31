import { Controller, Get, Post, Body, Req, Param, ParseIntPipe } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { UserEntity } from 'src/user/entities/user.entity';


@Controller()
export class FriendController {
  constructor(private readonly friendService: FriendService) {}



  @Get('send-friend-request/:id')
  async sendFriendReq(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.friendService.sendFriendReq(user.userId, id);
  }


  @Get('accept-friend-request/:id')
  async acceptFriendReq(
    @Param('id') requestId: string,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.friendService.acceptFriendReq(requestId, user.userId);
  }

  @Get('decline-friend-request/:id')
  async declineFriendReq(
    @Param('id') requestId: string,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.friendService.declineFriendReq(requestId, user.userId);
  }

  @Get('cancel-friend-request/:id')
  async cancelFriendReq(
    @Param('id') requestId: string,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.friendService.cancelFriendReq(requestId, user.userId);
  }

  @Get('friend-request-id/:id')
  async FriendReqId(
    @Param('id', ParseIntPipe) userId: number,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.friendService.FriendReqId(user.userId, userId);
  }


  @Get('unfriend/:id')
  async unfriend(
    @Param('id', ParseIntPipe) friendId: number,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.friendService.unfriend(user.userId, friendId);
  }

  @Get('friends/:id')
  async friends(@Param('id', ParseIntPipe) userId: number) {
    return await this.friendService.friends(userId);
  }


  @Get('friend-requests')
  async friendReqs(@Req() req) {
    const user: UserEntity = req.user;
    return await this.friendService.friendReqs(user.userId);
  }


  @Get('friendship-status/:id')  // friend  | request-sent | request-received | not-friend
  async friendshipStatus(
    @Param('id', ParseIntPipe) user2Id: number,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.friendService.friendshipStatus(user.userId, user2Id);
  }

}
