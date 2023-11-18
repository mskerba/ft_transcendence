import { Controller, Get, Post, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRTAuthGuard } from './guards/jwt-rt-auth.guard';
import { GetCurrentUserId, GetCurrentUser } from '../common/decorators/index';
import { Public } from '../common/decorators/public.decorator';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('google')
    @Public()
    @UseGuards(GoogleOauthGuard)
    async googleLogin() {
    }
    
    @Get('google/callback')
    @Public()
    @UseGuards(GoogleOauthGuard)
    async googleLoginCallBack(@Req() req) {
        const tokens = await this.authService.signIn(req.user);

        return tokens;
    }

    @Post('logout')
    logout(@GetCurrentUserId() userId: number) {
        return this.authService.logout(userId);
    }

    @Post('refresh')
    @Public()
    @UseGuards(JwtRTAuthGuard)
    refreshTokens(
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refreshToken') refreshToken: string
    ) {
        return this.authService.refreshTokens(userId, refreshToken);
    }


    @Get('enable-2fa')
    async enableTwoFactorAuth(
        @GetCurrentUserId() userId: number,
        @Res() res
    ) {
        const { secretKey, qrCodeUrl } = await this.authService.enableTwoFactorAuth(userId);

        res.json({ secretKey, qrCodeUrl });
    }

    @Post('verify-2fa')
    @Public()
    async verifyTwoFactorAuth(
        @Req() req,
        @Res() res,
    ) {
        const userId = 1;
        const { token } = req.body;

        const isTwoFactorEnabled = await this.authService.isTwoFactorEnabled(userId);

        if (isTwoFactorEnabled) {
            const verified = await this.authService.verifyTwoFactorAuth(userId, token);

            res.json({ success: verified });
        } else {
            res.json({ success: true, message: '2FA is not enabled for this user.' });
        }
    }


}