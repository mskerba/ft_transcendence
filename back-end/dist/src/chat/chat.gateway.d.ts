import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SaveUserService } from '../save-user/save-user.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly saveUserService;
    server: any;
    constructor(saveUserService: SaveUserService);
    connectedClients: Map<String, String>;
    handleConnection(client: Socket, body: any): Promise<void>;
    handleDisconnect(client: Socket): void;
    sendConnectedClient(): void;
    DirectMessage(client: Socket, payload: {
        Name: string;
        messageInput: string;
    }): void;
    serachOnVal(value: string): String;
}
