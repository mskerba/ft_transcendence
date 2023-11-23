import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRTStrategy } from './strategies/jwt-rt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Jwt2FAStrategy } from './strategies/jwt-2fa.strategy';


@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtStrategy, JwtRTStrategy, GoogleStrategy, Jwt2FAStrategy],
  imports: [UsersModule, PrismaModule, JwtModule.register({})],
})
export class AuthModule {}

