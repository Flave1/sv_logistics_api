import { Logger, OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket, Namespace } from 'socket.io';
import { CommonEvents, SocketResponse } from './dto';
import { ValidateGatewayUser } from 'src/auth/decorator';


@WebSocketGateway({
  cors: {
    // origin: [`${process.env['BASE_URL']}${process.env['CLIENT_PORT']}`],
    origin: '*'
  },
  // namespace:'foodiegateway'
})
export class GatewayService implements OnModuleInit, OnGatewayDisconnect, OnGatewayConnection {

  private readonly logger = new Logger(GatewayService.name);
  public connectedClients: Namespace;
  @WebSocketServer() //io: Namespace
  server: Server;

  onModuleInit() {
    this.server.on(CommonEvents.connection, (socket) => {
      console.log(socket.id + ' Connected');
    });
  }

  handleDisconnect(client: Socket) {
    const connectedClients = this.server.sockets;
    this.server.emit(CommonEvents.get_connected_clients, {
      msg: 'Connected customers',
      content: `${connectedClients.sockets.size} number of clients Connected`,
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.connectedClients = this.server.sockets;
    this.server.emit(CommonEvents.get_connected_clients, {
      msg: 'Connected customers',
      content: `${this.connectedClients.sockets.size} number of clients Connected`,
    });
  }


  @SubscribeMessage(CommonEvents.gateway_health)
  onNewMessage(@ValidateGatewayUser() token: string, @MessageBody() body: any) {
    this.logger.log(`socket is actually healthy`, token);
    this.server.emit(CommonEvents.gateway_health, {
      msg: 'Healthy',
      content: token,
    });
  }
  @SubscribeMessage(CommonEvents.join_room)
  async JoinRoom(@ValidateGatewayUser() token: string, @MessageBody() body: any) {
    const roomName = body.roomName;
    await this.connectedClients.socketsJoin(roomName)
    // console.log('joined', roomName);
    // const personsInRoom = this.connectedClients.adapter.rooms?.get(roomName)?.size;
    // this.connectedClients.to(roomName).emit(roomName, { message: `A client has joined ${roomName}` });
  }

  @SubscribeMessage(CommonEvents.leave_room)
  async LeaveRoom(@ValidateGatewayUser() token: string, @MessageBody() body: any) {
    const roomName = body.roomName;
    await this.connectedClients.socketsLeave(roomName)

    // console.log('left', roomName);
    // const personsInRoom = this.connectedClients.adapter.rooms?.get(roomName)?.size;
    this.connectedClients.to(roomName).emit(roomName, { message: `A client has left ${roomName}` });
  }

  async emitToClient(event: string, message: string = "") {
    const resp: SocketResponse = { message }
    this.server.emit(event, resp)
  }

  async emitToRoom(room: string, message: string = "") {
    const resp: SocketResponse = { message: `An update be dispatched to room ${room}` }
    // this.server.to(room).emit(room, resp)
    const er = this.connectedClients.to(room).emit(room, { message: `Dispached to room ${room}` });
    console.log('has sent', er);
  }
}
