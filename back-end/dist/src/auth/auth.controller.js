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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const google_oauth_guard_1 = require("./guards/google-oauth.guard");
const jwt_rt_auth_guard_1 = require("./guards/jwt-rt-auth.guard");
const index_1 = require("../common/decorators/index");
const public_decorator_1 = require("../common/decorators/public.decorator");
const jwt_2fa_auth_guard_1 = require("./guards/jwt-2fa-auth.guard");
const otp_code_dto_1 = require("./dto/otp-code.dto");
const _2fa_token_dto_1 = require("./dto/2fa-token.dto");
const _42_auth_guard_1 = require("./guards/42-auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async googleLogin() {
    }
    async fortyTwoLogin() {
    }
    async googleLoginCallBack(req, res) {
        const user = req.user;
        const tokens = await this.authService.signIn(user);
        res.cookie('accessToken', tokens.access_token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', tokens.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie('2faToken', tokens.TwoFA_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.redirect(process.env.FRONTEND_DOMAIN + '/');
    }
    async fortyTwoCallBack(req, res) {
        const user = req.user;
        const tokens = await this.authService.signIn(user);
        res.cookie('accessToken', tokens.access_token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', tokens.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie('2faToken', tokens.TwoFA_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.redirect(process.env.FRONTEND_DOMAIN + '/');
    }
    async logout(userId, res) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('2faToken');
        await this.authService.logout(userId);
        res.send('.');
    }
    async clearCookies(userId, res) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('2faToken');
        res.send('.');
    }
    async refreshTokens(userId, refreshToken, res) {
        const tokens = await this.authService.refreshTokens(userId, refreshToken);
        res.cookie('accessToken', tokens.access_token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', tokens.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie('2faToken', tokens.TwoFA_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send(tokens);
    }
    async isTwoFA_enabled(req) {
        const user = req.user;
        return user.twoFA_Enabled;
    }
    async generateTwoFactorAuthSecret(req) {
        const user = req.user;
        const qrCode = await this.authService.generateTwoFactorAuthSecret(user);
        return ({ qrCode });
    }
    async enableTwoFactorAuth(req, tokenDto) {
        const user = req.user;
        const enabled = await this.authService.enableTwoFactorAuth(user, tokenDto.token);
        return (enabled);
    }
    async verifyTwoFactorAuth(req, tokenDto) {
        const user = req.user;
        const verified = await this.authService.verifyTwoFactorAuth(user, tokenDto.token);
        return verified;
    }
    async sendOTPVerificationEmail(req) {
        const user = req.user;
        return await this.authService.sendOTPVerificationEmail(user);
    }
    async disableTwoFactorAuth(req, otpCodeDto) {
        const user = req.user;
        const disabled = await this.authService.disableTwoFactorAuth(user.userId, otpCodeDto.otp);
        return ({ success: disabled });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOauthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('42'),
    (0, common_1.UseGuards)(_42_auth_guard_1.FortyTwoStrategy),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fortyTwoLogin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOauthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLoginCallBack", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('42/callback'),
    (0, common_1.UseGuards)(_42_auth_guard_1.FortyTwoStrategy),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fortyTwoCallBack", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, index_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('clear-cookies'),
    (0, common_1.UseGuards)(jwt_rt_auth_guard_1.JwtRTAuthGuard),
    __param(0, (0, index_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "clearCookies", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('refresh'),
    (0, common_1.UseGuards)(jwt_rt_auth_guard_1.JwtRTAuthGuard),
    __param(0, (0, index_1.GetCurrentUserId)()),
    __param(1, (0, index_1.GetCurrentUser)('refreshToken')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, common_1.Get)('is-2fa-enabled'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "isTwoFA_enabled", null);
__decorate([
    (0, common_1.Get)('secret-2fa'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateTwoFactorAuthSecret", null);
__decorate([
    (0, common_1.Post)('enable-2fa'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, _2fa_token_dto_1.TwoFATokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableTwoFactorAuth", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('verify-2fa'),
    (0, common_1.UseGuards)(jwt_2fa_auth_guard_1.Jwt2FAGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, _2fa_token_dto_1.TwoFATokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyTwoFactorAuth", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('send-otp'),
    (0, common_1.UseGuards)(jwt_2fa_auth_guard_1.Jwt2FAGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOTPVerificationEmail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('disable-2fa'),
    (0, common_1.UseGuards)(jwt_2fa_auth_guard_1.Jwt2FAGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, otp_code_dto_1.OTPCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disableTwoFactorAuth", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map