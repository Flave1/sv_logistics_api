import { Logger, Req } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OrderService } from './order.service';
import { Request } from 'express';


@WebSocketGateway()
export class OrderGatewayService {

  constructor(private service: OrderService) { }
  private readonly logger = new Logger(OrderGatewayService.name);

  @SubscribeMessage('search_event_receiver')
  async handlePrivateMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket, @Req() req: Request) {
    try {
      const sessionId = data.sessionId;
      const searchString = data.searchString;
      const restaurantId = data.restaurantId;
      const response = await this.service.customerOrdersLiveSearch(req, restaurantId, searchString);
      client.emit(`search_event_responder`, { result: response, status: 200 });
    } catch (error) {
      client.emit(`search_event_responder`, { result: null, status: 500 });
    }
  }
}
