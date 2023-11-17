import { Exclude } from 'class-transformer'

export class UserEntity {

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

    user_id: number;

    name: string;

    email: string;

    avatar: string;

    @Exclude()
    provider: string;

    @Exclude()
    provider_id: string;

    @Exclude()
    hashed_rt: string

    registration_date: Date;
}
