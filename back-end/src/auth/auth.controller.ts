import { Controller, Get, Post, Req, Res, UseGuards, ParseIntPipe, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { JwtRTAuthGuard } from './guards/jwt-rt-auth.guard';
import { GetCurrentUserId, GetCurrentUser } from '../common/decorators/index';
import { Public } from '../common/decorators/public.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { Jwt2FAGuard } from './guards/jwt-2fa-auth.guard';
import { OTPCodeDto } from './dto/otp-code.dto';
import { TwoFATokenDto } from './dto/2fa-token.dto';


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
    async logout(@GetCurrentUserId() userId: number) {
        return await this.authService.logout(userId);
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