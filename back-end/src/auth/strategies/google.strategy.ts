import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: "38742815095-iqj8uekmraecr0lfbfs4eknjgunhn2b2.apps.googleusercontent.com", //process.env.GOOGLE_CLIENT_ID,
            clientSecret: "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", //process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback", //process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ) {
        const user: Partial<UserEntity> = {
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            provider: "google",
            provider_id: profile.id,
        };
        done(null, user);
    }
}