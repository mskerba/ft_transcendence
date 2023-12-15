import { HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto, CreateRoleUserDto, PunishDto, MuteDto } from './DTO/create-groups.dto';
export declare class ChatService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findUserById(userid: number): Promise<any>;
    findUserByname(username: string): Promise<object>;
    findUserBySockid(socketId: string): Promise<{
        userId: number;
    }>;
    SockToClient(socketId: string, username: string): Promise<void>;
    findLinkMessage(user1: number, user2: number): Promise<any>;
    LinkDirectMessage(sender: number, receiver: number): Promise<any>;
    addDirectMessage(sender: number, receiver: number, msg: string, Unseen: number): Promise<object>;
    FriendStatus(userId: number): Promise<{
        user1: {
            sockId: string;
        };
        user2: {
            sockId: string;
        };
    }[]>;
    MyFriends(user1: number): Promise<Map<number, object>>;
    chatHistory(id1: number, id2: number): Promise<{
        text: string;
        senderId: number;
    }[]>;
    createGroup(createGroupDto: CreateGroupDto): Promise<{
        RoomId: string;
        UserId: number;
        RoleName: string;
    } | {
        error: string;
    }>;
    addTogroup(createROle: CreateRoleUserDto): Promise<{
        RoleId: string;
        UserId: number;
        RoleName: string;
        RoomId: string;
    } | {
        error: string;
    }>;
    findGroupById(roomId: string): Promise<{
        RoomId: string;
        TypeRoom: string;
        avatar: string;
        title: string;
        password: string;
    }>;
    addMessageToRoom(roomId: string, message: string, uId: number): Promise<{
        RoomMessageId: string;
        text: string;
        RoomId: string;
        UserId: number;
    } | {
        error: string;
    }>;
    historyOfGroup(group: string): Promise<{
        text: string;
        UserId: number;
    }[]>;
    findUserInGroup(userId: number, roomId: string): Promise<{
        RoleId: string;
    }>;
    findRoleUser(senderId: number, group: string): Promise<{
        RoleName: string;
    }>;
    kickUser(punishDto: PunishDto): Promise<{
        error: string;
        status?: undefined;
        success?: undefined;
    } | {
        status: HttpStatus;
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
        status?: undefined;
    }>;
    banUser(punishDto: PunishDto): Promise<void>;
    muteUser(muteDto: MuteDto): Promise<void>;
}
