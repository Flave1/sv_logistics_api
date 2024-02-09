import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OrderService } from './order.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { OrderAcceptRequest } from '../dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(
        private orderService: OrderService
    ) { }

    @Get('/:status')
    async get(@Req() req: Request, @GetUser('restaurantId') restaurantId: number, @Param('status') status: number) {
        const response = await this.orderService.getCustomerOrders(req, restaurantId, status);
        return response;
    }

    @Get('/kitchen/:status')
    async getOrdersInKitchen(@Req() req: Request, @GetUser('restaurantId') restaurantId: number, @Param('status') status: number) {
        const response = await this.orderService.getOrdersInKitchen(req, restaurantId, status);
        return response;
    }

    @Post('/accept')
    async acceptOrder(@GetUser('restaurantId') restaurantId: number, @Body() request: OrderAcceptRequest) {
        const response = await this.orderService.acceptOrder(restaurantId, request.checkoutOrderId);
        return response;
    }

    @Post('/reject')
    async rejectOrder(@GetUser('restaurantId') restaurantId: number, @Body() request: OrderAcceptRequest) {
        const response = await this.orderService.rejectOrder(restaurantId, request.checkoutOrderId);
        return response;
    }

    @Post('/cancel')
    async cancelOrder(@GetUser('restaurantId') restaurantId: number, @Body() request: OrderAcceptRequest) {
        const response = await this.orderService.cancelOrder(restaurantId, request.checkoutOrderId);
        return response;
    }
    @Post('/reinstate')
    async reinsateOrder(@GetUser('restaurantId') restaurantId: number, @Body() request: OrderAcceptRequest) {
        const response = await this.orderService.reinstateOrder(restaurantId, request.checkoutOrderId);
        return response;
    }
    @Post('/prepare')
    async prepapreOrder(@GetUser('restaurantId') restaurantId: number, @Body() request: OrderAcceptRequest) {
        const response = await this.orderService.prepapreOrder(restaurantId, request.checkoutOrderId);
        return response;
    }
}