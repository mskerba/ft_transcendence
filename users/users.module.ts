import { Module } from '@nestjs/common';
import { userService } from './user.service';
import { UsersController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy'

@Module({
  controllers: [UsersController],
  providers: [userService, JwtStrategy],
  imports: [PrismaModule],
  exports: [userService],
})
export class UsersModule {}
