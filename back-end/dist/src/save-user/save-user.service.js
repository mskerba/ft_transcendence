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
exports.SaveUserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const faker_1 = require("@faker-js/faker");
let SaveUserService = class SaveUserService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async saveUser(username) {
        let user = await this.prismaService.user.create({
            data: {
                name: username,
                email: faker_1.faker.internet.email()
            },
        });
        return user;
    }
    async findUser(username) {
        return await this.prismaService.user.count({
            where: { name: username },
        });
    }
    async addSock(username, socketId) {
        if (this.findUser(username)) {
            await this.prismaService.user.update({
                where: { name: username },
                data: {
                    sockId: socketId
                },
            });
        }
        else {
            console.log("database not initialized yet");
        }
    }
};
exports.SaveUserService = SaveUserService;
exports.SaveUserService = SaveUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SaveUserService);
//# sourceMappingURL=save-user.service.js.map