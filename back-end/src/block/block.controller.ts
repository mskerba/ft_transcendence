import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { BlockService } from './block.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller()
export class BlockController {
  constructor(private readonly blockService: BlockService) {}


  @Get('blockedUsers')
  async blockedUsers(@Req() req) {
    const user: UserEntity = req.user;
    return await this.blockService.blockedUsers(user.userId);
  }



  @Get('block/:id')
  async block(
    @Param('id', ParseIntPipe) userId: number,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.blockService.block(user.userId, userId);
  }

  @Get('unblock/:id')
  async unblock(
    @Param('id') blockId: string,
    @Req() req,
  ) {
    const user: UserEntity = req.user;
    return await this.blockService.unblock(blockId, user.userId);
  }

}
