import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy'

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
