import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {SaveUserService} from '../save-user/save-user.service'
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection{
  
  constructor (private readonly saveUserService: SaveUserService){}

  handleConnection(client: Socket, @MessageBody() body : any) {
    const str = client.handshake.query.name;
    console.log("username is : ", str.toString(), " and socketId is : ", client.id);
    this.saveUserService.addSock(str.toString(), client.id);
  }
  
  @SubscribeMessage('message')
  handleMessage(client: Socket) : void{
       console.log("message is comming from id == ", client.id)
  }


}
