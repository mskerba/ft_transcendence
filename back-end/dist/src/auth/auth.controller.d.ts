import { AuthService } from './auth.service';
import { OTPCodeDto } from './dto/otp-code.dto';
import { TwoFATokenDto } from './dto/2fa-token.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    googleLogin(): Promise<void>;
    fortyTwoLogin(): Promise<void>;
    googleLoginCallBack(req: any, res: any): Promise<any>;
    fortyTwoCallBack(req: any, res: any): Promise<any>;
    logout(userId: number, res: any): Promise<any>;
    refreshTokens(userId: number, refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        TwoFA_token: string;
    }>;
    generateTwoFactorAuthSecret(req: any): Promise<{
        secretKey: string;
        qrCodeUrl: string;
    }>;
    enableTwoFactorAuth(req: any, tokenDto: TwoFATokenDto): Promise<{
        success: boolean;
    }>;
    sendOTPVerificationEmail(req: any): Promise<{
        status: string;
        message: string;
        data: {
            userId: number;
            email: string;
        };
    } | {
        status: string;
        message: any;
        data?: undefined;
    }>;
    disableTwoFactorAuth(userId: number, otpCodeDto: OTPCodeDto): Promise<{
        success: boolean;
    }>;
    verifyTwoFactorAuth(req: any, tokenDto: TwoFATokenDto): Promise<{
        success: boolean;
    }>;
}
