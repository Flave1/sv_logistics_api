import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket, Namespace } from 'socket.io';
export declare class GatewayService implements OnModuleInit, OnGatewayDisconnect, OnGatewayConnection {
    private readonly logger;
    connectedClients: Namespace;
    server: Server;
    onModuleInit(): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
    onNewMessage(token: string, body: any): void;
    JoinRoom(token: string, body: any): Promise<void>;
    LeaveRoom(token: string, body: any): Promise<void>;
    emitToClient(event: string, message?: string): Promise<void>;
    emitToRoom(room: string, message?: string): Promise<void>;
}
