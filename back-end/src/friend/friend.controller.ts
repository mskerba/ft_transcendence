import { Controller, Get, Post, Body, Req, Param, ParseIntPipe } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { UserEntity } from 'src/user/entities/user.entity';


@Controller()
export class FriendController {
  constructor(private readonly friendService: FriendService) {}



  @Post('send-friend-request')
  async sendFriendReq(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.friendService.sendFriendReq(user.userId, id);
  }


  @Get('accept-friend-request/:id')
  async acceptFriendReq(
    @Param('id') id: string,
    @Req() req,
  ) {
    return await this.friendService.acceptFriendReq(id);
  }

  @Get('decline-friend-request/:id')
  async declineFriendReq(
    @Param('id') id: string,
    @Req() req,
  ) {
    return await this.friendService.declineFriendReq(id);
  }

  @Get('friends') // -> list of friends
  async friends(@Req() req) {
    const user: UserEntity = req.user;
    return await this.friendService.friends(user.userId);
  }


  @Get('friend-requests') // -> list of friends requests
  async friendReqs(@Req() req) {
    const user: UserEntity = req.user;
    return await this.friendService.friendReqs(user.userId);
  }


  @Get('friendship-status/:id')  // friend  | request-sent | request-received | not-friend
  async friendshipStatus(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.friendService.friendshipStatus(id);
  }

}
