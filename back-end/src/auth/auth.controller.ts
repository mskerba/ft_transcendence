import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {
    }
    
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallBack(@Req() req) {
        console.log(req.user);
        return 'SUCCESSFULLY LOGGED IN!'
    }

    @Get('')
    @UseGuards(AuthGuard('google'))
    async hh() {
        return 'AAAAAAAAUUUUUUTTTHHH!'
    }
}
