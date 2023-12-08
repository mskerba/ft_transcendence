import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../chat/chat.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    afterInit(server: Server): void;
    Message(client: Socket, data: {
        to: number;
        msg: string;
    }): Promise<void>;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
