export declare class CreateUserDto {
    name: string;
    email: string;
    avatar: string;
    hashedRt: string;
    twoFA_Enabled: boolean;
    twoFA_SecretKey: string;
    twoFA_Verified: boolean;
}
