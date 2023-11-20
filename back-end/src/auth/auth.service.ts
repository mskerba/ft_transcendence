import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { generateFromEmail } from 'unique-username-generator';




@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async signIn(user) {
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
                hashed_rt: {
                    not: null,
                },
            },
            data: {
                hashed_rt: null,
                two_fa_verified: false,
            }
        });
    }

    async generateTwoFactorAuthSecret(user): Promise<{ secretKey: string; qrCodeUrl: string }> {
        if (user.two_fa_enabled) throw new ForbiddenException("the 2FA is already enabled");

        const secretKey = this.generateSecretKey();
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

    async enableTwoFactorAuth(user, token: string): Promise<boolean> {
        if (user.two_fa_enabled) throw new ForbiddenException("the 2FA is already enabled");

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

    async disableTwoFactorAuth(user, token: string): Promise<boolean> {
        if (!user.two_fa_enabled) throw new ForbiddenException("the 2FA is already disabled");

        const verified = speakeasy.totp.verify({
            secret: user.two_fa_secret_key,
            encoding: 'base32',
            token,
        });
        if (verified) {
            await this.usersService.update(user.user_id, {
                two_fa_enabled: false,
                two_fa_verified: false,
                two_fa_secret_key: null,
            });
        }
        else {
            throw new ForbiddenException("invalid token!");
        }
        return true;
    }

    async verifyTwoFactorAuth(userId: number, token: string): Promise<boolean> {
        const user = await this.usersService.findOne(userId);

        if (!user) throw new ForbiddenException('invalid user!');
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

    async updateRtHash(userId: number, rt: string) {
        const hash = await this.hashData(rt);

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


    generateSecretKey(): string {
        return speakeasy.generateSecret().base32;
    }

    async generateTokens(userId: number, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: 'at-secret',
                    expiresIn: 60 * 15,
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
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }



}
