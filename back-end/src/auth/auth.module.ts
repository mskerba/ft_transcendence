import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRTStrategy } from './strategies/jwt-rt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Jwt2FAStrategy } from './strategies/jwt-2fa.strategy';
import { FortyTwoStrategy } from './strategies/42.startegy';


@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtStrategy, JwtRTStrategy, GoogleStrategy, Jwt2FAStrategy, FortyTwoStrategy],
  imports: [UserModule, PrismaModule, JwtModule.register({})],
})
export class AuthModule {}

