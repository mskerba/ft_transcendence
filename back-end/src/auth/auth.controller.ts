import { Controller, Get, Post, Req, Res, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtRTAuthGuard } from './guards/jwt-rt-auth.guard';
import { GetCurrentUserId, GetCurrentUser } from '../common/decorators/index';
import { Public } from '../common/decorators/public.decorator';
import { Jwt2FAGuard } from './guards/jwt-2fa-auth.guard';
import { OTPCodeDto } from './dto/otp-code.dto';
import { TwoFATokenDto } from './dto/2fa-token.dto';
import { FortyTwoStrategy } from './guards/42-auth.guard';
import { UserEntity } from 'src/user/entities/user.entity';


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
    @Get('42')
    @UseGuards(FortyTwoStrategy)
    async fortyTwoLogin() {
    }
    
    @Public()
    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleLoginCallBack(@Req() req, @Res() res) {
        const user: UserEntity = req.user;
        const tokens = await this.authService.signIn(user);

        res.cookie('accessToken', tokens.access_token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
          });

          res.cookie('refreshToken', tokens.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          res.cookie('2faToken', tokens.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

        return res.redirect(process.env.FRONTEND_DOMAIN + '/profile');
    }

    @Public()
    @Get('42/callback')
    @UseGuards(FortyTwoStrategy)
    async fortyTwoCallBack(@Req() req, @Res() res) {
        const user: UserEntity = req.user;
        const tokens = await this.authService.signIn(user);

        res.cookie('accessToken', tokens.access_token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
        });
      
        // Set refresh token as a cookie with a 7-day expiration
        res.cookie('refreshToken', tokens.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        res.cookie('2faToken', tokens.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        return res.redirect(process.env.FRONTEND_DOMAIN + '/profile');
    }

    @Get('logout')
    async logout(
        @GetCurrentUserId() userId: number,
        @Res() res,
    ) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('2faToken');
        await this.authService.logout(userId);
        res.send('.');

    }

    @Public()
    @Get('refresh')
    @UseGuards(JwtRTAuthGuard)
    async refreshTokens(
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refreshToken') refreshToken: string,
        @Res() res
    ) {
        
        const tokens = await this.authService.refreshTokens(userId, refreshToken);

        res.cookie('accessToken', tokens.access_token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
        });
      
        // Set refresh token as a cookie with a 7-day expiration
        res.cookie('refreshToken', tokens.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        res.cookie('2faToken', tokens.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        res.send(tokens);
    }

    @Get('secret-2fa')
    async generateTwoFactorAuthSecret(@Req() req) {
        const user: UserEntity = req.user;
    
        const { secretKey, qrCodeUrl } = await this.authService.generateTwoFactorAuthSecret(user);

        return ({ secretKey, qrCodeUrl });
    }

    @Get('is-2fa-enabled')
    async isTwoFA_enabled(@Req() req) {
        const user: UserEntity = req.user;

        return user.twoFA_Enabled;
    }

    @Post('enable-2fa')
    async enableTwoFactorAuth(
        @Req() req,
        @Body() tokenDto: TwoFATokenDto,
    ) {
        const user: UserEntity = req.user;

        const enabled = await this.authService.enableTwoFactorAuth(user, tokenDto.token);
        return ({success: enabled});
    }


    @Public()
    @Post('send-otp')
    @UseGuards(Jwt2FAGuard)
    async sendOTPVerificationEmail(@Req() req) {
        const user: UserEntity = req.user;
        return await this.authService.sendOTPVerificationEmail(user);
    }

    @Public()
    @Post('disable-2fa')
    @UseGuards(Jwt2FAGuard)
    async disableTwoFactorAuth(
        @GetCurrentUserId() userId: number,
        @Body('otpCode') otpCodeDto: OTPCodeDto,
    ) {
        const disabled = await this.authService.disableTwoFactorAuth(userId, otpCodeDto.otp);
        return ({success: disabled});
    }

    @Public()
    @Post('verify-2fa')
    @UseGuards(Jwt2FAGuard)
    async verifyTwoFactorAuth(
        @Req() req,
        @Body() tokenDto: TwoFATokenDto,
    ) {
        const user: UserEntity = req.user;
        const verified = await this.authService.verifyTwoFactorAuth(user, tokenDto.token);
        return({ success: verified });
    }


}