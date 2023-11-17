import { Controller, Get, Post, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRTAuthGuard } from './guards/jwt-rt-auth.guard';
import { GetCurrentUserId, GetCurrentUser } from '../common/decorators/index'


@Controller('auth')
export class AuthController {
    constructor(private authSerivce: AuthService) {}

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleLogin() {
    }
    
    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleLoginCallBack(@Req() req) {
        const tokens = await this.authSerivce.signIn(req.user);

        return tokens;
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(@GetCurrentUserId() userId: number) {
        return this.authSerivce.logout(userId);
    }

    @Post('refresh')
    @UseGuards(JwtRTAuthGuard)
    refreshTokens(
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refreshToken') refreshToken: string
    ) {
        return this.authSerivce.refreshTokens(userId, refreshToken);
    }

}