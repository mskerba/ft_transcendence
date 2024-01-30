import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  controllers: [BlockController],
  providers: [BlockService],
  imports: [PrismaModule, FriendModule],
  exports: [BlockService]
})
export class BlockModule {}
