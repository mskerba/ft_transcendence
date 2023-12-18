import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('gamepaddle')
  handleGamePaddle(client: Socket, data: { x: number }) {
    console.log(`Received gamepaddle event from ${client.id}: ${data.x}`);
    this.server.emit('gamepaddleResponse', { message: `Received ${data.x} from ${client.id}` });
  }
}
