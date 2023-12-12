import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';


@Injectable()
export class JwtRTStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {

        const extractJwtFromCookie = (req) => {
            let token = null;

            if (req && req.cookies) {
                token = req.cookies['refreshToken'];
            }

            console.log(req.cookies);
            
            return token;
        };

        super({
            secretOrKey: process.env.RT_SECRET,
            jwtFromRequest: extractJwtFromCookie,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.cookies['refreshToken'];

        return {
            ... payload,
            refreshToken,
        }
    }
}