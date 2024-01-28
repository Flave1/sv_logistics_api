import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { GatewayService } from 'src/gateway/gateway.service';
import { OrderGatewayService } from './order.gateway.service';

@Module({
  providers: [OrderService, GatewayService, OrderGatewayService],
  controllers: [OrderController]
})
export class OrderModule {}
