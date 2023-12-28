"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
const google_strategy_1 = require("./strategies/google.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_rt_strategy_1 = require("./strategies/jwt-rt.strategy");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const user_module_1 = require("../user/user.module");
const prisma_module_1 = require("../prisma/prisma.module");
const jwt_2fa_strategy_1 = require("./strategies/jwt-2fa.strategy");
const _42_startegy_1 = require("./strategies/42.startegy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, email_service_1.EmailService, jwt_strategy_1.JwtStrategy, jwt_rt_strategy_1.JwtRTStrategy, google_strategy_1.GoogleStrategy, jwt_2fa_strategy_1.Jwt2FAStrategy, _42_startegy_1.FortyTwoStrategy],
        imports: [user_module_1.UserModule, prisma_module_1.PrismaModule, jwt_1.JwtModule.register({})],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map