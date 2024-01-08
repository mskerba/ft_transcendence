import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService],
  imports: [UserModule],
})
export class AvatarModule {}
