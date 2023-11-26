import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

export type JwtPayload = {
    sub: number,
    email: string,
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private userService: UserService) {
          
        super({
            secretOrKey: "at-secret",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findOne(payload.sub);
        if (!user) throw new UnauthorizedException();

        if (user.twoFA_Enabled && !user.twoFA_Verified) throw new UnauthorizedException('verify 2FA!');

        return user;
    }
}