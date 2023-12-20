"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const email_service_1 = require("./email.service");
let AuthService = class AuthService {
    constructor(userService, prisma, jwtService, emailService) {
        this.userService = userService;
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async signIn(user) {
        if (!user) {
            throw new common_1.BadRequestException("Unauthenticated");
        }
        const userExists = await this.userService.findByEmail(user.email);
        if (!userExists) {
            return this.signUp(user);
        }
        const tokens = await this.generateTokens(userExists.userId, userExists.email);
        await this.updateRtHash(userExists.userId, tokens.refresh_token);
        return { ...userExists, ...tokens };
    }
    async signUp(user) {
        const newUser = await this.userService.create(user);
        const tokens = await this.generateTokens(newUser.userId, newUser.email);
        await this.updateRtHash(newUser.userId, tokens.refresh_token);
        return { ...newUser, ...tokens };
    }
    async logout(userId) {
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
    async updateRtHash(userId, rt) {
        const hash = await bcrypt.hash(rt, 10);
        await this.userService.update(userId, { hashedRt: hash });
    }
    async refreshTokens(userId, rt) {
        const user = await this.userService.findOne(userId);
        if (!user || !user.hashedRt)
            throw new common_1.ForbiddenException('Access Denied!');
        const rtMatches = await bcrypt.compare(rt, user.hashedRt);
        if (!rtMatches)
            throw new common_1.ForbiddenException('Access Denied!');
        const tokens = await this.generateTokens(user.userId, user.email);
        await this.updateRtHash(user.userId, tokens.refresh_token);
        return tokens;
    }
    async generateTokens(userId, email) {
        const [at, rt, two_fa] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            }, {
                secret: process.env.AT_SECRET,
                expiresIn: 60 * 15,
            }),
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            }, {
                secret: process.env.RT_SECRET,
                expiresIn: 60 * 60 * 24 * 7,
            }),
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            }, {
                secret: process.env.TWOFA_SECRET,
                expiresIn: 60 * 60 * 24 * 7,
            }),
        ]);
        return {
            access_token: at,
            refresh_token: rt,
            TwoFA_token: two_fa,
        };
    }
    async generateTwoFactorAuthSecret(user) {
        if (user.twoFA_Enabled)
            throw new common_1.ForbiddenException("the 2FA is already enabled");
        const secretKey = speakeasy.generateSecret().base32;
        const otpAuthUrl = speakeasy.otpauthURL({
            secret: secretKey,
            label: 'PingPong',
            issuer: 'Taha',
        });
        const qrCodeUrl = await qrcode.toDataURL(otpAuthUrl);
        await this.userService.update(user.userId, {
            twoFA_SecretKey: secretKey,
        });
        return { secretKey, qrCodeUrl };
    }
    async enableTwoFactorAuth(user, token) {
        if (user.twoFA_Enabled)
            throw new common_1.ForbiddenException("the 2FA is already enabled");
        if (!user.twoFA_SecretKey)
            throw new common_1.ForbiddenException("No secret exists!");
        if (user.twoFA_SecretKey) {
            const verified = speakeasy.totp.verify({
                secret: user.twoFA_SecretKey,
                encoding: 'base32',
                token,
            });
            if (verified) {
                await this.userService.update(user.userId, {
                    twoFA_Enabled: true,
                    twoFA_Verified: true,
                });
                return true;
            }
            else {
                throw new common_1.ForbiddenException("invalid token!");
            }
        }
        return false;
    }
    async disableTwoFactorAuth(userId, otpCode) {
        const user = await this.prisma.user.findUnique({
            where: {
                userId: userId
            },
            include: {
                otpVerification: true
            },
        });
        if (!user.twoFA_Enabled)
            throw new common_1.ForbiddenException("the 2FA is already disabled");
        if (!user.otpVerification)
            throw new common_1.ForbiddenException("Send the OTP code to email!");
        const otpVerif = user.otpVerification;
        if (otpVerif.expiresAt < new Date())
            throw new common_1.ForbiddenException("the OTP code has expired!");
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
            throw new common_1.ForbiddenException("invalid OTP!");
        }
        return true;
    }
    async verifyTwoFactorAuth(user, token) {
        if (!user.twoFA_Enabled)
            throw new common_1.ForbiddenException('the Two Factor authentificator is not enabled');
        if (user.twoFA_Verified)
            throw new common_1.ForbiddenException('the Two Factor authentificator is already verified');
        const secretKey = user.twoFA_SecretKey;
        if (!secretKey) {
            return false;
        }
        const verified = speakeasy.totp.verify({
            secret: secretKey,
            encoding: 'base32',
            token,
        });
        if (verified) {
            await this.userService.update(user.userId, {
                twoFA_Verified: true,
            });
        }
        return verified;
    }
    async sendOTPVerificationEmail(user) {
        if (!user.twoFA_Enabled)
            throw new common_1.ForbiddenException('the Two Factor authentificator is not enabled');
        try {
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
            const hashed_otp = await bcrypt.hash(otp, 10);
            await this.prisma.userOTPVerification.deleteMany({ where: { userId: user.userId } });
            const newOTPVerification = await this.prisma.userOTPVerification.create({
                data: {
                    userId: user.userId,
                    otp: hashed_otp,
                    expiresAt: new Date(Date.now() + 36000000),
                }
            });
            await this.emailService.sendMail(user.email, "Verification code to disable the two factor authentificator", `<p>Enter <b>${otp}</b> in the app to disable the two factor authentificator</P><p>This code <b>expires in 1 hour</b></p>`);
            return ({
                status: "PENDING",
                message: "Verification otp email sent",
                data: {
                    userId: user.userId,
                    email: user.email
                }
            });
        }
        catch (error) {
            return ({
                status: "FAILED",
                message: error.mesage,
            });
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map