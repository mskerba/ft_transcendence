import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { generateFromEmail } from 'unique-username-generator';
import { UserEntity } from 'src/users/entities/user.entity';
import { EmailService } from './email.service';


export type OtpVerification = {
    id: number;
    userId: number;
    otp: string;
    expiresAt: Date;
}


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) {}

    async signIn(user: CreateUserDto) {
        if (!user) {
            throw new BadRequestException("Unauthenticated");
        }

        const userExists = await this.usersService.findByEmail(user.email);
        if (!userExists) {
            return this.signUp(user);
        }

        const tokens = await this.generateTokens(userExists.user_id, userExists.email);
        await this.updateRtHash(userExists.user_id, tokens.refresh_token);
        return {... userExists , ... tokens};
    }

    async signUp(user: CreateUserDto) {
        user.name = generateFromEmail(user.email, 5);
        const newUser = await this.usersService.create(user);

        const tokens = await this.generateTokens(newUser.user_id, newUser.email);
        await this.updateRtHash(newUser.user_id, tokens.refresh_token);
        return {... newUser , ... tokens};
    }

    async logout(userId: number) {
        await this.prisma.users.updateMany({
            where: {
                user_id: userId,
            },
            data: {
                hashed_rt: null,
                two_fa_verified: false,
            }
        });
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await bcrypt.hash(rt, 10);

        await this.usersService.update(userId, {hashed_rt: hash});
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.usersService.findOne(userId);
        if (!user || !user.hashed_rt) throw new ForbiddenException('Access Denied!');

        const rtMatches = await bcrypt.compare(rt, user.hashed_rt);
        if (!rtMatches) throw new ForbiddenException('Access Denied!');

        const tokens = await this.generateTokens(user.user_id, user.email);
        await this.updateRtHash(user.user_id, tokens.refresh_token);
        return tokens;
    }

    async generateTokens(userId: number, email: string) {
        const [at, rt, two_fa] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: 'at-secret',
                    expiresIn: 60 * 15 /*to be removed after*/ * 60,
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: 'rt-secret',
                    expiresIn: 60 * 60 * 24 * 7,
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: '2fa-secret',
                    expiresIn: 60 * 60 * 24 * 7,
                }
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
            TwoFA_token: two_fa,
        };
    }

    async generateTwoFactorAuthSecret(user: UserEntity): Promise<{ secretKey: string; qrCodeUrl: string }> {
        if (user.two_fa_enabled) throw new ForbiddenException("the 2FA is already enabled");

        const secretKey = speakeasy.generateSecret().base32;
        const otpAuthUrl = speakeasy.otpauthURL({
          secret: secretKey,
          label: 'PingPong',
          issuer: 'Taha',
        });

        const qrCodeUrl = await qrcode.toDataURL(otpAuthUrl);
        await this.usersService.update(user.user_id, {
            two_fa_secret_key: secretKey,
        });

        return { secretKey, qrCodeUrl };
    }

    async enableTwoFactorAuth(user: UserEntity, token: string): Promise<boolean> {
        if (user.two_fa_enabled) throw new ForbiddenException("the 2FA is already enabled");
        if (!user.two_fa_secret_key) throw new ForbiddenException("No secret exists!");

        if (user.two_fa_secret_key) {
            const verified = speakeasy.totp.verify({
                secret: user.two_fa_secret_key,
                encoding: 'base32',
                token,
            });
            if (verified) {
                await this.usersService.update(user.user_id, {
                    two_fa_enabled: true,
                    two_fa_verified: true,
                });
                return true;
            }
            else {
                throw new ForbiddenException("invalid token!");
            }
        }
        return false;
    }

    async disableTwoFactorAuth(userId: number, otpCode: string): Promise<boolean> {

        const user = await this.prisma.users.findUnique({
            where: {
                user_id: userId
            },
            include: {
                otpVerification: true
            },
        });

        
        if (!user.two_fa_enabled) throw new ForbiddenException("the 2FA is already disabled");
        if (!user.otpVerification) throw new ForbiddenException("Send the OTP code to email!");
        
        const otpVerif: OtpVerification = user.otpVerification;

        if (otpVerif.expiresAt < new Date()) throw new ForbiddenException("the OTP code has expired!");

        const otpMatches = await bcrypt.compare(otpCode, otpVerif.otp);
        if (otpMatches) {
            await this.usersService.update(user.user_id, {
                two_fa_enabled: false,
                two_fa_verified: false,
                two_fa_secret_key: null,
            });
            await this.prisma.userOTPVerification.deleteMany({ where: { userId, } });
        }
        else {
            throw new ForbiddenException("invalid OTP!");
        }
        return true; 
    }

    async verifyTwoFactorAuth(user: UserEntity, token: string): Promise<boolean> {

        if (!user.two_fa_enabled) throw new ForbiddenException('the Two Factor authentificator is not enabled');
        if (user.two_fa_verified) throw new ForbiddenException('the Two Factor authentificator is already verified');

    
        const secretKey = user.two_fa_secret_key;
        if (!secretKey) {
          return false;
        }
    
        const verified = speakeasy.totp.verify({
          secret: secretKey,
          encoding: 'base32',
          token,
        });

        if (verified) {
            await this.usersService.update(user.user_id, {
                two_fa_verified: true,
            });
        }
    
        return verified;
    }

    async sendOTPVerificationEmail(user: UserEntity) {
        if (!user.two_fa_enabled) throw new ForbiddenException('the Two Factor authentificator is not enabled');

        try {
            const otp: string = `${Math.floor(1000 + Math.random() * 9000)}`;

            
            const hashed_otp = await bcrypt.hash(otp, 10);


            await this.prisma.userOTPVerification.deleteMany({ where: { userId: user.user_id } });

            const newOTPVerification = await this.prisma.userOTPVerification.create({
                data: {
                    userId: user.user_id,
                    otp: hashed_otp,
                    expiresAt: new Date(Date.now() + 36000000),
                }
            });
            
            console.log(await this.prisma.userOTPVerification.findMany({}));
            
            await this.emailService.sendMail(
                user.email,
                "Verification code to disable the two factor authentificator",
                `<p>Enter <b>${otp}</b> in the app to disable the two factor authentificator</P><p>This code <b>expires in 1 hour</b></p>`

            );
            return ({
                status: "PENDING",
                message: "Verification otp email sent",
                data: {
                    userId: user.user_id,
                    email: user.email
                }
            });
        } catch (error) {
            return ({
                status: "FAILED",
                message: error.mesage,
            });
        }
    }
}
