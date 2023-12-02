import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { ChatGateway } from './chat/chat.gateway';
import { join } from 'path';
import { SaveUserService } from './save-user/save-user.service';
import { SaveUserController } from './save-user/save-user.controller';
import { SaveUserModule } from './save-user/save-user.module';


@Module({
  // imports: [AuthModule, PrismaModule, UserModule, FriendModule],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'html'),
    }),
    SaveUserModule,
    PrismaModule
  ],
  controllers: [AppController, SaveUserController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    ChatGateway,
    SaveUserService,
    

  ],
})
export class AppModule  {

}