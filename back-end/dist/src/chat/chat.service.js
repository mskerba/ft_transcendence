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
    async addDirectMessage(sender, receiver, msg, Unseen) {
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
                countUnseen: Unseen
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
        console.log("this is messages with given conversation ids: ", messages);
        let i = 0;
        messages.forEach(item => {
            let obj = { "Unseen": item.countUnseen, "name": user[i].name, lastMsg: item.text };
            mp.set(user[i].userId, obj);
            i++;
        });
        return mp;
    }
    async chatHistory(id1, id2) {
        const getLink = await this.prismaService.linkDirectMessage.findFirst({
            where: {
                OR: [
                    { AND: [{ UserId1: id1 }, { UserId2: id2 }] },
                    { AND: [{ UserId1: id2 }, { UserId2: id1 }] },
                ]
            },
            select: {
                conversationId: true,
            }
        });
        return await this.prismaService.directMessage.findMany({
            where: {
                privateId: getLink.conversationId,
            },
            select: {
                text: true,
                senderId: true,
            },
        });
    }
    async createGroup(createGroupDto) {
        let room = await this.prismaService.room.create({
            data: {
                TypeRoom: createGroupDto.TypeRoom,
                avatar: createGroupDto.avatar,
                title: createGroupDto.title,
                password: createGroupDto.password
            },
            select: {
                RoomId: true,
                TypeRoom: true,
                password: true,
            }
        });
        if (room.TypeRoom == "protected" && room.password == null) {
            this.prismaService.room.delete({
                where: {
                    RoomId: room.RoomId
                }
            });
            return ({ "error": "set the password for protected group" });
        }
        let UserGroup = await this.prismaService.roleUser.create({
            data: {
                roleUser: { connect: { userId: createGroupDto.UserId } },
                RoleName: "owner",
                roomId: { connect: { RoomId: room.RoomId } }
            },
            select: {
                UserId: true,
                RoleName: true,
                RoomId: true,
            }
        });
        return UserGroup;
    }
    async addTogroup(createROle) {
        const checkGroup = await this.prismaService.room.findUnique({
            where: {
                RoomId: createROle.roomId
            },
        });
        if (!checkGroup)
            return { "error": "group not found" };
        return await this.prismaService.roleUser.create({
            data: {
                roleUser: { connect: { userId: createROle.userId } },
                RoleName: createROle.roleName,
                roomId: { connect: { RoomId: createROle.roomId } }
            }
        });
    }
    async findGroupById(roomId) {
        const data = await this.prismaService.room.findUnique({
            where: {
                RoomId: roomId,
            }
        });
        return data;
    }
    async checkIsMuted(roomId, message, uId) {
        const time = await this.prismaService.muteUser.findFirst({
            where: {
                RoomId: roomId,
                UserId: uId,
            },
            select: {
                StartTime: true,
                EndTime: true,
                MuteUserId: true,
            }
        });
        if (time) {
            if (time.EndTime >= time.StartTime) {
                this.prismaService.muteUser.delete({
                    where: {
                        MuteUserId: time.MuteUserId
                    }
                });
            }
            else {
                return {
                    "error": "User is in Muted mode",
                    status: common_1.HttpStatus.FORBIDDEN
                };
            }
        }
        return {
            success: true,
            status: common_1.HttpStatus.OK
        };
    }
    async addMessageToRoom(roomId, message, uId) {
        const userInGroup = await this.findUserInGroup(uId, roomId);
        if (userInGroup.error != undefined)
            return userInGroup;
        const isMuted = await this.checkIsMuted(roomId, message, uId);
        if (isMuted.error != undefined)
            return isMuted;
        await this.prismaService.roomMessage.create({
            data: {
                text: message,
                roomId: { connect: { RoomId: roomId } },
                userId: { connect: { userId: uId } }
            }
        });
        return { success: true, status: common_1.HttpStatus.OK };
    }
    async historyOfGroup(group) {
        return await this.prismaService.roomMessage.findMany({
            where: {
                RoomId: group
            },
            select: {
                text: true,
                UserId: true,
            }
        });
    }
    async findUserInGroup(userId, roomId) {
        const data = await this.prismaService.roleUser.findFirst({
            where: {
                RoomId: roomId,
                UserId: userId,
            },
            select: {
                RoleId: true,
            }
        });
        if (data)
            return { success: true, status: common_1.HttpStatus.OK };
        return { "error": "user not belong to this room or you are banned", status: common_1.HttpStatus.BAD_REQUEST };
    }
    async findRoleUser(senderId, group) {
        return await this.prismaService.roleUser.findFirst({
            where: {
                UserId: senderId,
                RoomId: group,
            },
            select: {
                RoleName: true,
            }
        });
    }
    async PunishCheker(punishDto) {
        const Role1 = await this.findRoleUser(punishDto.senderId, punishDto.roomId);
        const Role2 = await this.findRoleUser(punishDto.userId, punishDto.roomId);
        if (!Role1 || !Role2)
            return { "error": "users or group not found " };
        const senderId = Role1.RoleName;
        const userId = Role2.RoleName;
        if (senderId == "member")
            return { "error": "the sender who wanna delete is regular member",
                status: common_1.HttpStatus.NOT_FOUND
            };
        if (senderId == "admin" && userId != "member")
            return { error: "admin can't kick another admin or owner",
                status: common_1.HttpStatus.NOT_FOUND
            };
        return { "success": true, status: common_1.HttpStatus.CREATED };
    }
    async kickUser(punishDto) {
        const data = await this.PunishCheker(punishDto);
        if (data.error !== undefined)
            return data;
        await this.prismaService.roleUser.deleteMany({
            where: {
                AND: [
                    { UserId: punishDto.userId },
                    { RoomId: punishDto.roomId },
                ]
            }
        });
        return data;
    }
    async banUser(punishDto) {
        const data = await this.PunishCheker(punishDto);
        if (data.error !== undefined)
            return data;
        try {
            await this.prismaService.banUser.create({
                data: {
                    roomId: { connect: { RoomId: punishDto.roomId } },
                    userId: { connect: { userId: punishDto.userId } },
                }
            });
            await this.prismaService.roleUser.deleteMany({
                where: {
                    AND: [
                        { UserId: punishDto.userId },
                        { RoomId: punishDto.roomId },
                    ]
                }
            });
            return data;
        }
        catch (error) {
            return {
                "error": "user already is banned or can't be banned",
                "status": common_1.HttpStatus.NOT_ACCEPTABLE
            };
        }
    }
    async muteUser(muteDto) {
        const data = await this.PunishCheker(muteDto);
        if (data.error != undefined)
            return data;
        try {
            await this.prismaService.muteUser.create({
                data: {
                    roomId: { connect: { RoomId: muteDto.roomId } },
                    userId: { connect: { userId: muteDto.userId } },
                    StartTime: new Date(Date.now()),
                    EndTime: new Date(Date.now() + (muteDto.numberHour * 60 * 60 * 1000)),
                }
            });
            return data;
        }
        catch (error) {
            return {
                "error": "user already muted or can't be muted",
                "status": common_1.HttpStatus.NOT_ACCEPTABLE
            };
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map