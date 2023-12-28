import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../chat/chat.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    afterInit(server: Server): void;
    mp: Map<string, number>;
    Message(client: Socket, data: {
        to: number;
        msg: string;
        Unseen: number;
    }): Promise<void>;
    ShareStatus(client: Socket): Promise<void>;
    handleConnection(client: Socket): Promise<void>;
    joinGroup(client: Socket, data: {
        group: string;
    }): void;
    messageTogroup(client: Socket, data: {
        group: string;
        message: string;
    }): Promise<{
        error: string;
    }>;
    handleDisconnect(client: Socket): {
        msg: string;
    };
}
