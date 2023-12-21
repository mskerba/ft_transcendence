import { UserService } from 'src/user/user.service';
export type JwtPayload = {
    sub: number;
    email: string;
};
declare const Jwt2FAStrategy_base: new (...args: any[]) => any;
export declare class Jwt2FAStrategy extends Jwt2FAStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<{
        userId: number;
        name: string;
        email: string;
        avatar: string;
        hashedRt: string;
        twoFA_Enabled: boolean;
        twoFA_Verified: boolean;
        twoFA_SecretKey: string;
        registrationDate: Date;
        sockId: string;
    }>;
}
export {};
