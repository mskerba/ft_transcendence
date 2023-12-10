"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("../chat/chat.service");
const common_1 = require("@nestjs/common");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
        this.mp = new Map;
    }
    afterInit(server) {
        console.log('WebSocket server initialized');
    }
    async Message(client, data) {
        console.log("id of sender : ", client.id);
        const obj = await this.chatService.findUserById(data.to);
        if (obj.sockId) {
            console.log("msg sent to the socket");
            client.to(obj.sockId).emit("FrontDirectMessage", this.mp[client.id], data.msg);
        }
    }
    async ShareStatus(client) {
        const friends = await this.chatService.FriendStatus(this.mp[client.id]);
        friends.forEach(item => {
            if (item.user1.sockId == client.id)
                client.to(item.user2.sockId).emit("status", this.mp[client.id], "in game");
            else
                client.to(item.user1.sockId).emit("status", this.mp[client.id], "in game");
        });
    }
    async handleConnection(client) {
        console.log("client connected : id: ", client.id);
        await this.chatService.SockToClient(client.id, client.handshake.headers.origin);
        const { userId } = await this.chatService.findUserBySockid(client.id);
        this.mp.set(client.id, userId);
        console.log("im userId == ", userId);
        const friends = await this.chatService.FriendStatus(userId);
        if (friends.length) {
            friends.forEach(item => {
                if (item.user1.sockId == client.id)
                    client.to(item.user2.sockId).emit("status", userId, "online");
                else
                    client.to(item.user1.sockId).emit("status", userId, "online");
            });
        }
    }
    handleDisconnect(client) {
        console.log("disconnected client : ", client.id);
        this.mp.delete(client.id);
        console.log("disconnected name is : ", client.handshake.headers.origin);
        this.chatService.SockToClient(null, client.handshake.headers.origin);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('DirectMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "Message", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('inGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "ShareStatus", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map