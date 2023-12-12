import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {ChatService} from '../chat/chat.service'
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  

  
  @WebSocketServer()
  server : Server;

  constructor (private readonly chatService: ChatService){}

  afterInit(server: Server) {
    // WebSocket server is ready
    console.log('WebSocket server initialized');
  }


  mp = new Map<string, number>;

  @SubscribeMessage('DirectMessage')
  async Message(client: Socket, data : {to: number, msg: string})
  {
    console.log("id of sender : ", client.id);
    

    const obj = await this.chatService.findUserById(data.to);
    if (obj.sockId)
    {
      console.log("msg sent to the socket");
      client.to(obj.sockId).emit("FrontDirectMessage", this.mp[client.id] ,data.msg);
    }

    // const obj2 = await this.chatService.addDirectMessage(userId, data.to, data.msg );

  }
  

  @SubscribeMessage('inGame')
  async ShareStatus(client: Socket){

    const friends = await this.chatService.FriendStatus(this.mp[client.id]);
    
    friends.forEach(item => {
      if (item.user1.sockId == client.id)
        client.to(item.user2.sockId).emit("status", this.mp[client.id], "in game");
      else
        client.to(item.user1.sockId).emit("status", this.mp[client.id], "in game");

    })

  }

  
  async handleConnection(client: Socket) {
    console.log("client connected : id: ", client.id);
    // friends that have socketId in that database
    // i will broadcast to them that im connected
    // the same logic in disconnection 

    // i will replace this using the id that will be sent to me  -- client.handshake.headers.origin
    await this.chatService.SockToClient(client.id , client.handshake.headers.origin);
 
    const {userId} = await this.chatService.findUserBySockid(client.id);
    
    this.mp.set(client.id, userId);
    
    console.log("im userId == ", userId);
    const friends = await this.chatService.FriendStatus(userId);
    // console.log(friends.length);  
    // console.log("all friends that i talk with", friends);

     if (friends.length)
     {

        friends.forEach(item => {
          if (item.user1.sockId == client.id)
            client.to(item.user2.sockId).emit("status", userId, "online");
          else
            client.to(item.user1.sockId).emit("status", userId, "online");
          })
     }
  
  }

  

  handleDisconnect(client: Socket) {
      console.log("disconnected client : ", client.id);
    

      this.mp.delete(client.id);
      console.log("disconnected name is : ", client.handshake.headers.origin);
      this.chatService.SockToClient(null, client.handshake.headers.origin);
  
  }
 




}
