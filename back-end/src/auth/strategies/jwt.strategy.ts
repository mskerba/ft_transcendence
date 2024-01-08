import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

export type JwtPayload = {
    sub: number,
    email: string,
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private userService: UserService) {
        const extractJwtFromCookie = (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['accessToken'];
            }

            return token;
        };

        super({
            secretOrKey: process.env.AT_SECRET,
            jwtFromRequest: extractJwtFromCookie,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findOne(payload.sub);
        if (!user) throw new UnauthorizedException();

        if (user.twoFA_Enabled && !user.twoFA_Verified) throw new UnauthorizedException('verify 2FA!');

        return user;
    }
}