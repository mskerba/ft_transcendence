import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../chat/chat.service'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import decodeJwtFromCookies from '../common/get-userId-from-cookie'
import { PrismaService } from 'src/prisma/prisma.service';






@Injectable()
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {



    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService,
        private prisma: PrismaService) { }

    // mp first string have sockId;
    // mp second name 


    afterInit(server: Server) {
        console.log('WebSocket server initialized');
    }
    mp = new Map<string, number>();

    async handleConnection(client: Socket) {
        const cookies = client?.handshake?.headers?.cookie || '';
        const userId: number | null = decodeJwtFromCookies(cookies);


        try {

            await this.chatService.SockToClient(client.id, userId, "online");
            this.mp.set(client.id, userId);
            console.log("user give me his id is : ", this.mp.get(client.id), "and connected to ", client.id);
        } catch (error) {
            console.log("error in setUser");
        }

        // send im online
        this.sendStatus(client, userId, "online");



        // friends that have socketId in that database
        // i will broadcast to them that im connected
        // the same logic in disconnection 


        //return {msg: "sucessfuly connected to socketa"}
        // i will replace this using the id that will be sent to me  -- client.handshake.headers.origin

        // await this.chatService.SockToClient(client.id , client.handshake.headers.origin);

        // const {userId} = await this.chatService.findUserBySockid(client.id);

        // this.mp.set(client.id, userId);

        // console.log("im userId == ", userId);
        // const friends = await this.chatService.FriendStatus(userId);
        // // console.log(friends.length);  
        // // console.log("all friends that i talk with", friends);

        //  if (friends.length)
        //  {

        //     friends.forEach(item => {
        //       if (item.user1.sockId == client.id)
        //         client.to(item.user2.sockId).emit("status", userId, "online");
        //       else
        // client.to(item.user1.sockId).emit("status", userId, "online");
        //       })
        //  }

    }
    async handleDisconnect(client: Socket) {
        console.log("disconnected client : ", client.id, " from : ", this.mp.get(client.id));

        this.sendStatus(client, this.mp.get(client.id), "offline");

        try {
            await this.chatService.SockToClient(null, this.mp.get(client.id), "offline");
            this.mp.delete(client.id);
            return { msg: "client disconnected from socket" }
        } catch (error) {
            console.log("error: client can't disconnect");
        }
    }

    async sendStatus(client: Socket, userId: number, stat: string) {
        try {
            const friends = await this.chatService.FriendStatus(userId);

            if (friends.length) {

                friends.forEach(item => {
                    if (item.user1.sockId == client.id)
                        client.to(item.user2.sockId).emit("status", { userId, "status": stat });
                    else
                        client.to(item.user1.sockId).emit("status", { userId, "status": stat });
                })
            }
        } catch (error) {
            console.log("error in online")
        }
    }

    @SubscribeMessage('DirectMessage')
    async Message(client: Socket, data: { to: string, msg: string, Unseen: number }) {

        console.log("MESSAGE")

        try {
            const sender = await this.chatService.findUserBySockid(client.id);
            const receiver = await this.chatService.findUserByname(data.to);
            await this.chatService.addDirectMessage(sender.userId, receiver.userId, data.msg, 3);
            if (receiver.sockId) {
                client.to(receiver.sockId).emit("FrontDirectMessage", { "Message": data.msg, "Unseen": data.Unseen });
            }
        } catch (error) { }

    }


    @SubscribeMessage('inGame')
    async ShareStatus(client: Socket, isInGame: boolean) {
        console.log("isInGame", isInGame)
        const status: string = isInGame ? 'in game' : 'online';

        this.sendStatus(client, this.mp.get(client.id), status);

        try {
            await this.chatService.SockToClient(null, this.mp.get(client.id), status);
        } catch (error) { }

    }






    //join group when you click on group
    @SubscribeMessage("joinGroup")
    joinGroup(client: Socket, data: { group: string }) {
        console.log("====>>clientId: ", client.id, " join group ", data.group);
        client.join(data.group);
    }

    @SubscribeMessage("messageTogroup")
    async messageTogroup(client: Socket, data: { group: string, message: string }) {

        try {

            const groupId = await this.chatService.findGroupById(data.group);
            if (!groupId)
                return { "error": "group not found" }

            const user = await this.chatService.findUserBySockid(client.id);
            if (!user) {
                console.log("user not found");
                return;
            }
            this.server.to(data.group)
                .emit("FrontDirectMessage", {
                    Message: data.message,
                    Unseen: 6,
                    Avatar: user.avatar,
                    Id: user.userId,
                    name: user.name
                });



            console.log("id : ", user, "data ", data);
            await this.chatService.addMessageToRoom(data.group, data.message, user.userId);
        } catch (error) {
            console.log("error in send to group");
        }
    }

    //Create game with freind 
    @SubscribeMessage("createPrivateGame")
    async createPrivateGame(client: Socket, data: { to: string, gameID: string }) {
        try {
            const user = await this.chatService.findUserBySockid(client.id);
            const obj = await this.chatService.findUserByname(data.to);
            console.log("====>>create private game: ", obj.sockId, data.to);
            if (obj.sockId) {
                client.to(obj.sockId).emit("FrontCreatePrivateGame", { "from": user.userId, "gameID": data.gameID, });
            }
        } catch (error) {
            console.log("error on sockId or name");
        }

    }


    @SubscribeMessage('removePrivateGame')
    async handleRemovePrivateGame(client: Socket, data: { to: number }) {
        
        try {
            const obj = await this.prisma.user.findUnique({
                where: { userId: data.to },
                select: {
                    sockId: true,
                }
            })
            
            console.log("====>>create private game: ", obj.sockId, data.to);
            if (obj.sockId) {
                client.to(obj.sockId).emit("toHome", {});
            }
        } catch (error) {
            console.log("error on sockId or name");
        }
    }

    @SubscribeMessage('removePrivateGame')
    async seen(client: Socket, data: { convId: string, isGroup: boolean }) {

        const user = await this.chatService.findUserBySockid(client.id);

        if (data.isGroup) {
            return ;
        }
    }

}
