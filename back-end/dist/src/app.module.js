"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const chat_gateway_1 = require("./chatGateway/chat.gateway");
const path_1 = require("path");
const chat_service_1 = require("./chat/chat.service");
const chat_controller_1 = require("./chat/chat.controller");
const chat_module_1 = require("./chat/chat.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '../../', 'html'),
            }),
            chat_module_1.ChatModule,
            prisma_module_1.PrismaModule
        ],
        controllers: [app_controller_1.AppController, chat_controller_1.ChatController],
        providers: [
            app_service_1.AppService,
            chat_gateway_1.ChatGateway,
            chat_service_1.ChatService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map