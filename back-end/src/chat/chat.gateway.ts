import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../chat/chat.service'
import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import decodeJwtFromCookies from '../common/get-userId-from-cookie'
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';






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

    async handleConnection(client: Socket, ...args: any[]) {

        let data: any;
        let userId: number;


        if (client?.handshake?.query.userId === undefined) {
            this.handleDisconnect(client);
            return;
        } else {
            data = client?.handshake?.query;
            userId = parseInt(data.userId);
        }


        try {

            await this.chatService.SockToClient(client.id, userId, "online");
            this.mp.set(client.id, userId);
        } catch (error) { }

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

        await this.sendStatus(client, this.mp.get(client.id), "offline");

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
            const createdMsg = await this.chatService.addDirectMessage(sender.userId, receiver.userId, data.msg);
            if (receiver.sockId) {
                client.to(receiver.sockId).emit("FrontDirectMessage", {
                    Message: data.msg,
                    convId: createdMsg.privateId,
                });
            }

        } catch (error) { }

    }


    @SubscribeMessage('inGame')
    async ShareStatus(client: Socket, isInGame: boolean) {

        console.log('INGAME STATUS1: ', isInGame);
        console.log('INGAME STATUS2: ', isInGame);
        const status: string = isInGame ? 'in game' : 'online';


        this.sendStatus(client, this.mp.get(client.id), status);
        try {
            await this.chatService.SockToClient(client.id, this.mp.get(client.id), status);
        } catch (error) { }

    }






    //join group when you click on group
    @SubscribeMessage("joinGroup")
    async joinGroup(client: Socket, data: { group: string }) {

        const user = await this.chatService.findUserBySockid(client.id);

        const notMuted = await this.chatService.checkIsMuted(data.group, user.userId);
        if (notMuted.error) return;

        client.join(data.group);
    }

    @SubscribeMessage("mute")
    async mute(client: Socket, data: { userId: number, roomId: string }) {

        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    userId: data.userId,
                },
                select: {
                    sockId: true,
                },
            });

            if (!user) return;

            const _client = this.server.sockets.sockets.get(user.sockId);
            if (_client) {
                _client.leave(data.roomId);
                client.to(user.sockId).emit('refresh', { convId: data.roomId});
            }
        } catch (err) { }
    }

    @SubscribeMessage("addToGroup")
    async addToGroup(client: Socket, data: { name: string, roomId: string }) {

        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    name: data.name,
                },
                select: {
                    sockId: true,
                }
            });

            const _client = this.server.sockets.sockets.get(user.sockId);
            if (_client) {
                _client.join(data.roomId);
            }
        } catch (err) { }
    }



    @SubscribeMessage("messageTogroup")
    async messageTogroup(client: Socket, data: { group: string, message: string }) {

        console.log("!!!!!!!!!!!!!!!!!!!!!!!id is ", client.id, "data is : ", data);
        try {

            const groupId = await this.chatService.findGroupById(data.group);
            if (!groupId)
                return { "error": "group not found" }

            const user = await this.chatService.findUserBySockid(client.id);
            if (!user) {
                console.log("user not found");
                return;
            }
            const notMuted = await this.chatService.checkIsMuted(data.group, user.userId);
            if (notMuted.error) return;

            this.server.to(data.group)
                .emit("FrontDirectMessage", {
                    Message: data.message,
                    Avatar: user.avatar,
                    Id: user.userId,
                    name: user.name,
                    convId: data.group,
                });



            console.log("id : ", user, "data ", data);
            await this.chatService.addMessageToRoom(data.group, data.message, user.userId);
        } catch (error) {
            console.log("error in send to group");
        }
    }

    //Create game with freind 
    @SubscribeMessage("createPrivateGame")
    async createPrivateGame(client: Socket, data: { userId: number, gameID: string }) {
        try {
            console.log("c*^%#$^&^%#%&^#^%^$#%$&$%^@%^    createPrivateGame")
            const user = await this.chatService.findUserBySockid(client.id);
            const opponent = await this.prisma.user.findUnique({ where: { userId: data.userId } });
            if (opponent.sockId) {
                client.to(opponent.sockId).emit("FrontCreatePrivateGame", { "from": user.name, "gameID": data.gameID, });
            }
        } catch (error) {
            console.log("error on sockId or name");
        }

    }


    @SubscribeMessage('removePrivateGame')
    async handleRemovePrivateGame(client: Socket, data: { to: string }) {

        try {
            const obj = await this.prisma.user.findUnique({
                where: { name: data.to },
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

    @SubscribeMessage('seen')
    async seen(client: Socket, data: { convId: string, isGroup: boolean }) {

        const user = await this.chatService.findUserBySockid(client.id);

        if (data.isGroup) {
            await this.changeGroupUseenCount(data.convId, user.userId);
        } else {
            await this.changeDMUseenCount(data.convId, user.userId);
        }
    }

    async changeDMUseenCount(convId: string, userId: number) {
        // find the conversation first
        const conv = await this.prisma.linkDirectMessage.findUnique({
            where: {
                conversationId: convId,
            }
        });

        if (!conv) return;

        const updateField = (userId === conv.UserId1) ? 'user1Count' : 'user2Count';

        // update count to zero
        await this.prisma.linkDirectMessage.update({
            where: {
                conversationId: convId,
            },
            data: {
                [updateField]: 0,
            },
        });
    }

    async changeGroupUseenCount(convId: string, userId: number) {
        try {

            const roleUser = await this.prisma.roleUser.updateMany({
                where: {
                    UserId: userId,
                    RoomId: convId,
                },
                data: {
                    unseenCount: 0,
                },
            });

        } catch (error) { }
    }

}
