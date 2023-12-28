export declare class UserEntity {
    constructor(partial: Partial<UserEntity>);
    userId: number;
    name: string;
    email: string;
    avatar: string;
    registrationDate: Date;
    hashedRt: string;
    twoFA_Enabled: boolean;
    twoFA_SecretKey: string;
    twoFA_Verified: boolean;
}
