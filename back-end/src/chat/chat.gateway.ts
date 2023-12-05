import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {SaveUserService} from '../save-user/save-user.service'
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer()
  server;

  constructor (private readonly saveUserService: SaveUserService){}


  connectedClients = new Map<String, String>;

  
  async handleConnection(client: Socket, @MessageBody() body : any) {
    
    const str = client.handshake.query.name;
    console.log("username is : ", str.toString(), " and socketId is : ", client.id);

    
    this.connectedClients.set(str.toString(), client.id);
    
    await this.saveUserService.addSock(str.toString(), client.id);

    this.sendConnectedClient();  
  }
  

  handleDisconnect(client: Socket) {

  // delete connected client from the set
  console.log("the client is disconnected : ", client.handshake.query.name.toString());
    this.connectedClients.delete(client.handshake.query.name.toString());  
   this.sendConnectedClient();
  }
 
  sendConnectedClient(){
      this.server.emit('listClients', Array.from(this.connectedClients));
  }


  // get the message and send it to the other client
  @SubscribeMessage('SendToClient')
  DirectMessage(client: Socket, payload: { Name: string , messageInput: string}): void
  {

    const {Name , messageInput} = payload;

    console.log(payload);
    let clients = this.connectedClients;

    
    if (clients.has(Name))
    {
      console.log(clients.get(Name));
      this.server.to(clients.get(Name)).emit('DirectMessage', {
        from : client.id,
        msg : messageInput
      })
    }
    else
    {
      // i will save the message to db until will be online
    }
  
  }

  // @SubscribeMessage('message')
  // handleMessage(client: Socket) : void{
  //      console.log("message is comming from id == ", client.id)
  // }

}
