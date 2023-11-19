import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: "FORTYTWO_APP_ID",
            clientSecret: "FORTYTWO_APP_SECRET",
            callbackURL: "http://localhost:3000/auth/42/callback",
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
    ) {
        const user = {
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            provider: "google",
            provider_id: profile.id,
        };
        done(null, user);
    }
}