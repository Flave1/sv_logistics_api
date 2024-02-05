import { Logger, Req } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Request } from 'express';
import { CustomerService } from './customer.service';


@WebSocketGateway()
export class OrderGatewayService {

  constructor(private service: CustomerService) { }
  private readonly logger = new Logger(OrderGatewayService.name);

  @SubscribeMessage('header_search_event_receiver')
  async handlePrivateMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket, @Req() req: Request) {
    try {
      const searchString = data.searchString;
      const restaurantId = data.restaurantId;
      console.log('restaurantId', restaurantId);
      
      const response = await this.service.customerMenuLiveSearch(req, restaurantId, searchString);
      client.emit(`header_search_event_responder`, { result: response, status: 200 });
    } catch (error) {
      client.emit(`header_search_event_responder`, { result: null, status: 500 });
    }
  }
}
