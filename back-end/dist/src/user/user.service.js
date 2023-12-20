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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        try {
            return await this.prisma.user.create({ data: createUserDto });
        }
        catch (e) {
            if (e.code === 'P2002' && e.meta?.target?.includes('name')) {
                throw new common_1.ConflictException('Unique constraint violation: Duplicate value for the unique field.');
            }
            throw e;
        }
    }
    findOne(id) {
        return this.prisma.user.findUnique({
            where: {
                userId: id,
            },
        });
    }
    findByEmail(email) {
        return this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }
    update(id, updateUserDto) {
        return this.prisma.user.update({
            where: {
                userId: id,
            },
            data: updateUserDto,
        });
    }
    remove(id) {
        return this.prisma.user.delete({
            where: {
                userId: id,
            },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map