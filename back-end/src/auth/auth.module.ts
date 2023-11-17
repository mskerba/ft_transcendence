import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRTStrategy } from './strategies/jwt-rt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRTStrategy, GoogleStrategy],
  imports: [UsersModule, PrismaModule, JwtModule.register({})],
})
export class AuthModule {}

