import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

export type JwtPayload = {
    sub: number,
    email: string,
}

@Injectable()
export class Jwt2FAStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor(private userService: UserService) {

        const extractJwtFromCookie = (req) => {
            let token = null;

            if (req && req.cookies) {
                token = req.cookies['2faToken'];
            }

            console.log(req.cookies);
            
            return token;
        };

          
        super({
            secretOrKey: process.env.TWOFA_SECRET,
            jwtFromRequest: extractJwtFromCookie,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findOne(payload.sub);
        if (!user) throw new UnauthorizedException();

        return user;
    }
}