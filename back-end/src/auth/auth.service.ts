import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as qrcode from 'qrcode';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { EmailService } from './email.service';
import { authenticator } from 'otplib';


export type OtpVerification = {
    id: number;
    userId: number;
    otp: string;
    expiresAt: Date;
}


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async signIn(user: CreateUserDto) {
        if (!user) {
            throw new BadRequestException("Unauthenticated");
        }

        const userExists = await this.userService.findByEmail(user.email);
        if (!userExists) {
            return this.signUp(user);
        }

        const tokens = await this.generateTokens(userExists.userId, userExists.email);
        await this.updateRtHash(userExists.userId, tokens.refresh_token);
        return { ...userExists, ...tokens };
    }

    async signUp(user: CreateUserDto) {
        try {
            const newUser = await this.generateUniqueNameAndSave(user);
            // const newUser = await this.userService.create(user);

            const tokens = await this.generateTokens(newUser.userId, newUser.email);
            await this.updateRtHash(newUser.userId, tokens.refresh_token);
            return { ...newUser, ...tokens };
        } catch (error) { console.error(error); }

    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                userId,
            },
            data: {
                hashedRt: null,
                twoFA_Verified: false,
            }
        });
    }

    async generateUniqueNameAndSave(user: CreateUserDto): Promise<UserEntity | null> {
        const generateUniqueName = (): string => {
            const prefix = 'user_';
            const timestamp = Date.now().toString();
            const randomPart = Math.random().toString(36).substring(2, 8); // Adjust the length as needed
            const generatedName = `${prefix}${timestamp}_${randomPart}`;

            // Ensure the total length does not exceed 32 characters
            if (generatedName.length <= 32) {
                return generatedName;
            } else {
                // If the generated name exceeds 32 characters, truncate it
                return generatedName.substring(0, 32);
            }
        };

        const trySaveUser = async (name: string): Promise<UserEntity | null> => {
            try {
                const savedUser = await this.prisma.user.create({
                    data: {
                        name,
                        ...user,
                    },
                });
                return savedUser;
            } catch (error) {
                return null;
            }
        };

        const maxAttempts = 5;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const newName = generateUniqueName();

            const savedUser = await trySaveUser(newName);

            if (savedUser) {
                return savedUser;
            }
        }

        return null;
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await bcrypt.hash(rt, 10);

        await this.userService.update(userId, { hashedRt: hash });
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.userService.findOne(userId);
        if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied!');

        const rtMatches = await bcrypt.compare(rt, user.hashedRt);
        if (!rtMatches) throw new ForbiddenException('Access Denied!');

        const tokens = await this.generateTokens(user.userId, user.email);
        await this.updateRtHash(user.userId, tokens.refresh_token);
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
                    secret: process.env.AT_SECRET,
                    expiresIn: 60 * 15,
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: process.env.RT_SECRET,
                    expiresIn: 60 * 60 * 24 * 7,
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: process.env.TWOFA_SECRET,
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
        if (user.twoFA_Enabled) throw new ForbiddenException("the 2FA is already enabled");

        const secret = authenticator.generateSecret();
        const otpAuth = authenticator.keyuri(user.email, 'PongGreen', secret);
        const qrCode = await qrcode.toDataURL(otpAuth);


        await this.userService.update(user.userId, {
            twoFA_SecretKey: secret,
        });

        return qrCode;
    }

    async enableTwoFactorAuth(user: UserEntity, token: string): Promise<boolean> {
        if (user.twoFA_Enabled) throw new ForbiddenException("the 2FA is already enabled");
        if (!user.twoFA_SecretKey) throw new ForbiddenException("No secret exists!");

        if (user.twoFA_SecretKey) {
            const verified = authenticator.check(token, user.twoFA_SecretKey);
            if (verified) {
                await this.userService.update(user.userId, {
                    twoFA_Enabled: true,
                    twoFA_Verified: true,
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

        const user = await this.prisma.user.findUnique({
            where: {
                userId: userId
            },
            include: {
                otpVerification: true
            },
        });


        if (!user.twoFA_Enabled) throw new ForbiddenException("the 2FA is already disabled");
        if (!user.otpVerification) throw new ForbiddenException("Send the OTP code to email!");

        const otpVerif: OtpVerification = user.otpVerification;

        if (otpVerif.expiresAt < new Date()) throw new ForbiddenException("the OTP code has expired!");

        const otpMatches = await bcrypt.compare(otpCode, otpVerif.otp);
        if (otpMatches) {
            await this.userService.update(user.userId, {
                twoFA_Enabled: false,
                twoFA_Verified: false,
                twoFA_SecretKey: null,
            });
            await this.prisma.userOTPVerification.deleteMany({ where: { userId, } });
        }
        else {
            throw new ForbiddenException("invalid OTP!");
        }
        return true;
    }

    async verifyTwoFactorAuth(user: UserEntity, token: string): Promise<boolean> {

        if (!user.twoFA_Enabled) throw new ForbiddenException('the Two Factor authentificator is not enabled');
        if (user.twoFA_Verified) throw new ForbiddenException('the Two Factor authentificator is already verified');


        const secretKey = user.twoFA_SecretKey;
        if (!secretKey) {
            return false;
        }

        const verified = authenticator.check(token, secretKey);

        if (verified) {
            await this.userService.update(user.userId, {
                twoFA_Verified: true,
            });
        }

        return verified;
    }

    async sendOTPVerificationEmail(user: UserEntity) {
        if (!user.twoFA_Enabled) throw new ForbiddenException('the Two Factor authentificator is not enabled');

        try {
            const otp: string = `${Math.floor(1000 + Math.random() * 9000)}`;


            const hashed_otp = await bcrypt.hash(otp, 10);


            await this.prisma.userOTPVerification.deleteMany({ where: { userId: user.userId } });

            const newOTPVerification = await this.prisma.userOTPVerification.create({
                data: {
                    userId: user.userId,
                    otp: hashed_otp,
                    expiresAt: new Date(Date.now() + 36000000),
                }
            });


            await this.emailService.sendMail(
                user.email,
                "Verification code to disable the two factor authentificator",
                `<p>Enter <b>${otp}</b> in the app to disable the two factor authentificator</P><p>This code <b>expires in 1 hour</b></p>`

            );
            return ({
                status: "PENDING",
                message: "Verification otp email sent",
                data: {
                    userId: user.userId,
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
