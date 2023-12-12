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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
var Multimap = require('multimap');
let ChatService = class ChatService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async findUserById(userid) {
        return await this.prismaService.user.findFirst({
            where: { userId: userid },
            select: {
                name: true,
                sockId: true,
            },
        });
    }
    async findUserByname(username) {
        return await this.prismaService.user.findFirst({
            where: { name: username },
            select: {
                userId: true,
            },
        });
    }
    async findUserBySockid(socketId) {
        return await this.prismaService.user.findFirst({
            where: { sockId: socketId },
            select: {
                userId: true,
            },
        });
    }
    async SockToClient(socketId, username) {
        const data = await this.findUserByname(username);
        console.log(data);
        if (data) {
            await this.prismaService.user.update({
                where: { name: username },
                data: {
                    sockId: socketId,
                },
            });
        }
        else
            console.log("this client not found");
    }
    async findLinkMessage(user1, user2) {
        const data = await this.prismaService.linkDirectMessage.findFirst({
            where: {
                UserId1: user1,
                UserId2: user2,
            },
            select: {
                conversationId: true,
            },
        });
        return (data);
    }
    async LinkDirectMessage(sender, receiver) {
        const data = await this.prismaService.linkDirectMessage.create({
            data: {
                UserId1: sender,
                UserId2: receiver,
            },
            select: {
                conversationId: true,
            }
        });
        return (data);
    }
    async addDirectMessage(sender, receiver, msg) {
        console.log("the param is : ", sender, " : ", receiver, " : ", msg);
        let str = await this.findLinkMessage(sender, receiver);
        if (!str)
            str = await this.LinkDirectMessage(sender, receiver);
        console.log("this is str: ", str);
        const data = await this.prismaService.directMessage.create({
            data: {
                text: msg,
                userid: { connect: { userId: sender } },
                PrvMsgId: { connect: { conversationId: str.conversationId } },
            },
            select: {
                text: true,
                privateId: true,
                senderId: true,
            }
        });
        return data;
    }
    async FriendStatus(userId) {
        const data = await this.prismaService.friendship.findMany({
            where: {
                OR: [
                    { user1Id: userId, },
                    { user2Id: userId, },
                ],
                AND: [
                    { user1: { sockId: { not: null } } },
                    { user2: { sockId: { not: null } } }
                ]
            },
            select: {
                user1: { select: { sockId: true } },
                user2: { select: { sockId: true } },
            }
        });
        return data;
    }
    async MyFriends(user1) {
        let mp = new Map();
        const data = await this.prismaService.linkDirectMessage.findMany({
            where: {
                OR: [
                    { UserId1: user1 },
                    { UserId2: user1 },
                ],
            },
            select: {
                user1: { select: { userId: true, name: true } },
                user2: { select: { userId: true, name: true } },
                conversationId: true,
            },
        });
        let user = data.map((id) => {
            if (id.user1.userId != user1)
                return id.user1;
            return id.user2;
        });
        console.log("this is user Id : ", user);
        let ids = data.map((client) => client.conversationId);
        console.log("this is ids: ", ids);
        const messages = await this.prismaService.directMessage.findMany({
            where: {
                privateId: {
                    in: ids
                }
            },
            orderBy: [{
                    dateMessage: 'desc',
                },
            ],
            distinct: ['privateId'],
            select: {
                privateId: true,
                countUnseen: true,
                text: true,
            }
        });
        console.log("this is messages with give conversation ids: ", messages);
        let i = 0;
        messages.forEach(item => {
            let obj = { "Unseen": item.countUnseen, "name": user[i].name, lastMsg: item.text };
            mp.set(user[i].userId, obj);
            i++;
        });
        return mp;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map