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
    logout(userId: number, res: any): Promise<void>;
    clearCookies(userId: number, res: any): Promise<void>;
    refreshTokens(userId: number, refreshToken: string, res: any): Promise<void>;
    isTwoFA_enabled(req: any): Promise<boolean>;
    generateTwoFactorAuthSecret(req: any): Promise<{
        qrCode: {
            secretKey: string;
            qrCodeUrl: string;
        };
    }>;
    enableTwoFactorAuth(req: any, tokenDto: TwoFATokenDto): Promise<boolean>;
    verifyTwoFactorAuth(req: any, tokenDto: TwoFATokenDto): Promise<boolean>;
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
    disableTwoFactorAuth(req: any, otpCodeDto: OTPCodeDto): Promise<{
        success: boolean;
    }>;
}
