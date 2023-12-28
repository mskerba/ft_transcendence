import { Exclude } from 'class-transformer'

export class UserEntity {

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

    userId: number;

    name: string;

    email: string;

    avatar: string;

    registrationDate: Date;

    @Exclude()
    hashedRt: string;

    @Exclude()
    twoFA_Enabled: boolean;

    @Exclude()
    twoFA_SecretKey: string;

    @Exclude()
    twoFA_Verified: boolean;
}
