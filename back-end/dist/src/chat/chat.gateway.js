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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const save_user_service_1 = require("../save-user/save-user.service");
const common_1 = require("@nestjs/common");
let ChatGateway = class ChatGateway {
    constructor(saveUserService) {
        this.saveUserService = saveUserService;
        this.connectedClients = new Map;
    }
    async handleConnection(client, body) {
        const str = client.handshake.query.name;
        console.log("username is : ", str.toString(), " and socketId is : ", client.id);
        this.connectedClients.set(str.toString(), client.id);
        await this.saveUserService.addSock(str.toString(), client.id);
        this.sendConnectedClient();
    }
    handleDisconnect(client) {
        console.log("the client is disconnected : ", client.handshake.query.name.toString());
        this.connectedClients.delete(client.handshake.query.name.toString());
        this.sendConnectedClient();
    }
    sendConnectedClient() {
        this.server.emit('listClients', Array.from(this.connectedClients));
    }
    DirectMessage(client, payload) {
        const { Name, messageInput } = payload;
        console.log(payload);
        let clients = this.connectedClients;
        if (clients.has(Name)) {
            console.log(clients.get(Name));
            this.server.to(clients.get(Name)).emit('DirectMessage', {
                from: this.serachOnVal(client.id),
                to: Name,
                msg: messageInput,
            });
        }
        else {
        }
    }
    serachOnVal(value) {
        for (const [key, val] of this.connectedClients.entries()) {
            if (val == value)
                return key;
        }
        return undefined;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('SendToClient'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "DirectMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [save_user_service_1.SaveUserService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map