import { Exclude } from 'class-transformer'

export class UserEntity {

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

    user_id: number;

    name: string;

    email: string;

    avatar: string;

    registration_date: Date;
    
    // @Exclude()
    provider: string;

    // @Exclude()
    provider_id: string;

    // @Exclude()
    hashed_rt: string;

    // @Exclude()
    two_fa_enabled: boolean;

    // @Exclude()
    two_fa_secret_key: string;

    // @Exclude()
    two_fa_verified: boolean;
}
