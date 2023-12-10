import { ChatService } from './chat.service';
import { CreateGroupDto } from './DTO/create-groups.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createGroup(createGroupDto: CreateGroupDto): {
        msg: string;
    };
}
