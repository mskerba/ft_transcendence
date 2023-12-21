import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FriendController],
  providers: [FriendService],
  imports: [PrismaModule],
})
export class FriendModule {}
