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
        senderId: number;
        text: string;
    }[]>;
    createGroup(createGroupDto: CreateGroupDto): Promise<{
        UserId: number;
        RoomId: string;
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
    checkIsMuted(roomId: string, message: string, uId: number): Promise<{
        error: string;
        status: HttpStatus;
        success?: undefined;
    } | {
        success: boolean;
        status: HttpStatus;
        error?: undefined;
    }>;
    addMessageToRoom(roomId: string, message: string, uId: number): Promise<{
        error: string;
        status: HttpStatus;
        success?: undefined;
    } | {
        success: boolean;
        status: HttpStatus;
        error?: undefined;
    }>;
    historyOfGroup(group: string): Promise<{
        UserId: number;
        text: string;
    }[]>;
    findUserInGroup(userId: number, roomId: string): Promise<{
        success: boolean;
        status: HttpStatus;
        error?: undefined;
    } | {
        error: string;
        status: HttpStatus;
        success?: undefined;
    }>;
    findRoleUser(senderId: number, group: string): Promise<{
        RoleName: string;
    }>;
    PunishCheker(punishDto: PunishDto): Promise<{
        error: string;
        status?: undefined;
        success?: undefined;
    } | {
        error: string;
        status: HttpStatus;
        success?: undefined;
    } | {
        success: boolean;
        status: HttpStatus;
        error?: undefined;
    }>;
    kickUser(punishDto: PunishDto): Promise<{
        error: string;
        status?: undefined;
        success?: undefined;
    } | {
        error: string;
        status: HttpStatus;
        success?: undefined;
    } | {
        success: boolean;
        status: HttpStatus;
        error?: undefined;
    }>;
    banUser(punishDto: PunishDto): Promise<{
        error: string;
        status?: undefined;
        success?: undefined;
    } | {
        error: string;
        status: HttpStatus;
        success?: undefined;
    } | {
        success: boolean;
        status: HttpStatus;
        error?: undefined;
    }>;
    muteUser(muteDto: MuteDto): Promise<{
        error: string;
        status?: undefined;
        success?: undefined;
    } | {
        error: string;
        status: HttpStatus;
        success?: undefined;
    } | {
        success: boolean;
        status: HttpStatus;
        error?: undefined;
    }>;
}
