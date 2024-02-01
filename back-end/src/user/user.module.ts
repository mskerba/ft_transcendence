import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlockModule } from 'src/block/block.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, BlockModule],
  exports: [UserService],
})
export class UserModule {}
