import { Controller, Get, Post, Req, Res, UseGuards, ParseIntPipe, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtRTAuthGuard } from './guards/jwt-rt-auth.guard';
import { GetCurrentUserId, GetCurrentUser } from '../common/decorators/index';
import { Public } from '../common/decorators/public.decorator';
import { UserEntity } from 'src/users/entities/user.entity';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Public()
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleLogin() {
    }
    
    @Public()
    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleLoginCallBack(@Req() req) {
        const user: UserEntity = req.user;
        return new UserEntity(await this.authService.signIn(user));
    }

    @Post('logout')
    logout(@Req() req) {
        const user: UserEntity = req.user;

        return this.authService.logout(user.user_id);
    }

    @Post('refresh')
    @Public()
    @UseGuards(JwtRTAuthGuard)
    refreshTokens(
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ) {
        
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @Get('secret-2fa')
    async generateTwoFactorAuthSecret(@Req() req) {
        const user: UserEntity = req.user;
    
        const { secretKey, qrCodeUrl } = await this.authService.generateTwoFactorAuthSecret(user);

        return ({ secretKey, qrCodeUrl });
    }

    @Post('enable-2fa')
    async enableTwoFactorAuth(@Req() req) {
        const user: UserEntity = req.user;
        const { token } = req.body;

        const enabled = await this.authService.enableTwoFactorAuth(user, token);
        return ({success: enabled});
    }

    @Post('disable-2fa')
    async disableTwoFactorAuth(@Req() req, @Body('token') token: string) {
        const user: UserEntity = req.user;

        const disabled = await this.authService.disableTwoFactorAuth(user, token);
        return ({success: disabled});
    }

    @Post('verify-2fa')
    @Public()
    async verifyTwoFactorAuth(@Body('userId', ParseIntPipe) userId: number, @Body('token') token: string) {

        const verified = await this.authService.verifyTwoFactorAuth(userId, token);
        return({ success: verified });
    }


}