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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const create_groups_dto_1 = require("./DTO/create-groups.dto");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async MyFriends(param) {
        const id = parseInt(param.ide);
        return await this.chatService.MyFriends(id);
    }
    async historyOfGroup(group) {
        console.log("group Id : ", group.id);
        return this.chatService.historyOfGroup(group.id);
    }
    async ChatHistory(param) {
        const id1 = parseInt(param.id1);
        const id2 = parseInt(param.id2);
        console.log("first id : ", id1, " second id: ", id2);
        return this.chatService.chatHistory(id1, id2);
    }
    createGroup(createGroupDto) {
        console.log("this is the data that come : ", createGroupDto);
        return this.chatService.createGroup(createGroupDto);
    }
    addToGroup(creatRole) {
        return this.chatService.addTogroup(creatRole);
    }
    async kickUser(punishDto) {
        const data = await this.chatService.kickUser(punishDto);
        if (data.error !== undefined)
            throw new common_1.HttpException(data.error, common_1.HttpStatus.NOT_FOUND);
        return data;
    }
    async banUser(punishDto) {
        const data = await this.chatService.banUser(punishDto);
        if (data.error !== undefined)
            throw new common_1.HttpException(data.error, data.status);
        return data;
    }
    async muteUser(muteDto) {
        const data = await this.chatService.muteUser(muteDto);
        if (data.error !== undefined)
            throw new common_1.HttpException(data.error, data.status);
        return data;
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(':ide'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "MyFriends", null);
__decorate([
    (0, common_1.Get)('group/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "historyOfGroup", null);
__decorate([
    (0, common_1.Get)(":id1/:id2"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "ChatHistory", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_groups_dto_1.CreateGroupDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Post)('group/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_groups_dto_1.CreateRoleUserDto]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "addToGroup", null);
__decorate([
    (0, common_1.Post)('group/kick'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_groups_dto_1.PunishDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "kickUser", null);
__decorate([
    (0, common_1.Post)('group/ban'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_groups_dto_1.PunishDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "banUser", null);
__decorate([
    (0, common_1.Post)('group/mute'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_groups_dto_1.MuteDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "muteUser", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map