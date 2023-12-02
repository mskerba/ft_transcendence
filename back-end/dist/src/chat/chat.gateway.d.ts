import { OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SaveUserService } from '../save-user/save-user.service';
export declare class ChatGateway implements OnGatewayConnection {
    private readonly saveUserService;
    constructor(saveUserService: SaveUserService);
    handleConnection(client: Socket, body: any): void;
    handleMessage(client: Socket): void;
}
