import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { EmailService } from './email.service';
export type OtpVerification = {
    id: number;
    userId: number;
    otp: string;
    expiresAt: Date;
};
export declare class AuthService {
    private userService;
    private prisma;
    private jwtService;
    private emailService;
    constructor(userService: UserService, prisma: PrismaService, jwtService: JwtService, emailService: EmailService);
    signIn(user: CreateUserDto): Promise<{
        access_token: string;
        refresh_token: string;
        TwoFA_token: string;
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
    signUp(user: CreateUserDto): Promise<{
        access_token: string;
        refresh_token: string;
        TwoFA_token: string;
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
    logout(userId: number): Promise<void>;
    updateRtHash(userId: number, rt: string): Promise<void>;
    refreshTokens(userId: number, rt: string): Promise<{
        access_token: string;
        refresh_token: string;
        TwoFA_token: string;
    }>;
    generateTokens(userId: number, email: string): Promise<{
        access_token: string;
        refresh_token: string;
        TwoFA_token: string;
    }>;
    generateTwoFactorAuthSecret(user: UserEntity): Promise<{
        secretKey: string;
        qrCodeUrl: string;
    }>;
    enableTwoFactorAuth(user: UserEntity, token: string): Promise<boolean>;
    disableTwoFactorAuth(userId: number, otpCode: string): Promise<boolean>;
    verifyTwoFactorAuth(user: UserEntity, token: string): Promise<boolean>;
    sendOTPVerificationEmail(user: UserEntity): Promise<{
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
}
