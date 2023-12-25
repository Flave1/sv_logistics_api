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
var GatewayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const dto_1 = require("./dto");
const decorator_1 = require("../auth/decorator");
let GatewayService = GatewayService_1 = class GatewayService {
    constructor() {
        this.logger = new common_1.Logger(GatewayService_1.name);
    }
    onModuleInit() {
        this.server.on(dto_1.CommonEvents.connection, (socket) => {
            console.log(socket.id + ' Connected');
        });
    }
    handleDisconnect(client) {
        const connectedClients = this.server.sockets;
        this.server.emit(dto_1.CommonEvents.get_connected_clients, {
            msg: 'Connected customers',
            content: `${connectedClients.sockets.size} number of clients Connected`,
        });
    }
    handleConnection(client, ...args) {
        this.connectedClients = this.server.sockets;
        this.server.emit(dto_1.CommonEvents.get_connected_clients, {
            msg: 'Connected customers',
            content: `${this.connectedClients.sockets.size} number of clients Connected`,
        });
    }
    onNewMessage(token, body) {
        this.logger.log(`socket is actually healthy`, token);
        this.server.emit(dto_1.CommonEvents.gateway_health, {
            msg: 'Healthy',
            content: token,
        });
    }
    async JoinRoom(token, body) {
        const roomName = body.roomName;
        await this.connectedClients.socketsJoin(roomName);
        this.connectedClients.to(roomName).emit(roomName, { message: `A client has joined ${roomName}` });
    }
    async LeaveRoom(token, body) {
        const roomName = body.roomName;
        await this.connectedClients.socketsLeave(roomName);
        this.connectedClients.to(roomName).emit(roomName, { message: `A client has left ${roomName}` });
    }
    async emitToClient(event, message = "") {
        const resp = { message };
        this.server.emit(event, resp);
    }
    async emitToRoom(room, message = "") {
        const resp = { message };
        this.server.to(room).emit(room, resp);
    }
};
exports.GatewayService = GatewayService;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GatewayService.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(dto_1.CommonEvents.gateway_health),
    __param(0, (0, decorator_1.ValidateGatewayUser)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GatewayService.prototype, "onNewMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(dto_1.CommonEvents.join_room),
    __param(0, (0, decorator_1.ValidateGatewayUser)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GatewayService.prototype, "JoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(dto_1.CommonEvents.leave_room),
    __param(0, (0, decorator_1.ValidateGatewayUser)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GatewayService.prototype, "LeaveRoom", null);
exports.GatewayService = GatewayService = GatewayService_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [`http://localhost:3000`]
        },
    })
], GatewayService);
//# sourceMappingURL=gateway.service.js.map