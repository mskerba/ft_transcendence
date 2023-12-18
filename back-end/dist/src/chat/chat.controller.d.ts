import { HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateGroupDto, CreateRoleUserDto, PunishDto, MuteDto } from './DTO/create-groups.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    MyFriends(param: any): Promise<any>;
    historyOfGroup(group: any): Promise<{
        UserId: number;
        text: string;
    }[]>;
    ChatHistory(param: any): Promise<any>;
    createGroup(createGroupDto: CreateGroupDto): Promise<{
        RoomId: string;
        UserId: number;
        RoleName: string;
    } | {
        error: string;
    }>;
    addToGroup(creatRole: CreateRoleUserDto): Promise<{
        RoleId: string;
        UserId: number;
        RoleName: string;
        RoomId: string;
    } | {
        error: string;
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
