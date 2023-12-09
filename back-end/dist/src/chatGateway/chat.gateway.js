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
    }
    afterInit(server) {
        console.log('WebSocket server initialized');
    }
    async Message(client, data) {
        console.log("id of sender : ", client.id);
        const { userId } = await this.chatService.findUserBySockid(client.id);
    }
    async handleConnection(client) {
        console.log("client connected : id: ", client.id);
        await this.chatService.SockToClient(client.id, client.handshake.headers.origin);
        const { userId } = await this.chatService.findUserBySockid(client.id);
        console.log("im userId == ", userId);
        const test = await this.chatService.FriendStatus(userId);
        console.log("all friends that i talk with", test);
        if (test) {
            test.forEach(item => {
                if (item.user1.sockId == client.id)
                    client.to(item.user2.sockId).emit("status", userId, "online");
                else
                    client.to(item.user1.sockId).emit("status", userId, "online");
            });
        }
    }
    handleDisconnect(client) {
        console.log("disconnected client : ", client.id);
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
exports.ChatGateway = ChatGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map