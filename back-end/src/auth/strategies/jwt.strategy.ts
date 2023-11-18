import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

export type JwtPayload = {
    sub: number,
    email: string,
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersService: UsersService) {
          
        super({
            secretOrKey: "at-secret",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersService.findOne(payload.sub);
        if (!user) throw new UnauthorizedException();

        return payload;
    }
}