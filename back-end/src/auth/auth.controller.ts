import { Controller, Get, Post, Req, Res, UseGuards, HttpStatus, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRTAuthGuard } from './guards/jwt-rt-auth.guard';
import { GetCurrentUserId, GetCurrentUser } from '../common/decorators/index';
import { Public } from '../common/decorators/public.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Get('google')
    @Public()
    @UseGuards(GoogleOauthGuard)
    async googleLogin() {
    }
    
    @Get('google/callback')
    @Public()
    @UseGuards(GoogleOauthGuard)
    async googleLoginCallBack(@Req() req) {
        return new UserEntity(await this.authService.signIn(req.user));
    }

    @Post('logout')
    logout(@Req() req) {
        const user = req.user;

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

    @Get('enable-2fa')
    async enableTwoFactorAuth(@Req() req) {
        const user = req.user;

        if (user.two_fa_enabled) return ;
    
        const { secretKey, qrCodeUrl } = await this.authService.enableTwoFactorAuth(user.user_id);

        return ({ secretKey, qrCodeUrl });
    }

    @Post('disable-2fa')
    async disableTwoFactorAuth(@Req() req) {
        const user = req.user;
        const { token } = req.body;

        await this.authService.disableTwoFactorAuth(user, token);
    }

    @Post('verify-2fa')
    @Public()
    async verifyTwoFactorAuth(@Req() req) {
        const { userId, token } = req.body;

        const user = await this.usersService.findOne(userId);

        if (!user) throw new ForbiddenException('invalid user!');

        if (user.two_fa_enabled && !user.two_fa_verified) {
            const verified = await this.authService.verifyTwoFactorAuth(user, token);
            
            return({ success: verified });
        }
    }


}