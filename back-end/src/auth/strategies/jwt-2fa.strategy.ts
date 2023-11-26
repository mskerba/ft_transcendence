import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

export type JwtPayload = {
    sub: number,
    email: string,
}

@Injectable()
export class Jwt2FAStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor(private userService: UserService) {
          
        super({
            secretOrKey: "2fa-secret",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findOne(payload.sub);
        if (!user) throw new UnauthorizedException();

        return user;
    }
}