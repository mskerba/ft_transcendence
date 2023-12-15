import { ChatService } from './chat.service';
import { CreateGroupDto, CreateRoleUserDto, PunishDto, MuteDto } from './DTO/create-groups.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    historyOfGroup(group: any): Promise<{
        text: string;
        UserId: number;
    }[]>;
    MyFriends(param: any): Promise<any>;
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
    kickUser(punishDto: PunishDto): {
        success: string;
    };
    banUser(punishDto: PunishDto): Promise<void>;
    muteUser(muteDto: MuteDto): Promise<void>;
}
