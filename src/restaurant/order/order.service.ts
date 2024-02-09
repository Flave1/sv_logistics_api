import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { GatewayService } from 'src/gateway/gateway.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getBaseUrl, getButtonColor, getPaymentStatusLabel, getStatusLabel, getStatusLabelForOrdersInKitchen } from 'src/utils';
import { Request } from 'express';
import { OrderStatus } from '../enums';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService, private socket: GatewayService) { }
    private readonly logger = new Logger(GatewayService.name);
    orderQuery(restaurantId: number, status: any) {
        if (parseInt(status) !== -1) {
            return {
                restaurantId: restaurantId,
                status: parseInt(status)
            }
        } else {
            return {
                restaurantId: restaurantId,
            }
        }
    }
    orderInKitchenQuery(restaurantId: number, status: any) {
        if (parseInt(status) !== -1) {
            return {
                restaurantId: restaurantId,
                status: parseInt(status)
            }
        } else {
            return {
                restaurantId: restaurantId,
                OR: [
                    { status: OrderStatus.OrderAccepted },
                    { status: OrderStatus.Packaged }
                ]
            }
        }
    }
    async getCustomerOrders(req: Request, restaurantId: number, status: number) {
        try {
            const orderCheckout = await this.prisma.orderCheckout.findMany({
                where: this.orderQuery(restaurantId, status),
                orderBy: [{
                    status: 'asc'
                }, {
                    createdAt: 'desc',
                }],
                include: {
                    menuOrders: {
                        select: {
                            id: true,
                            orderId: true,
                            status: true,
                            quantity: true,
                            menu: {
                                select: {
                                    name: true,
                                    price: true,
                                    image: true,
                                    status: true,
                                }
                            }
                        }
                    },
                    address: {
                        select: {
                            name: true,
                            label: true,
                            latitude: true,
                            longitude: true
                        }
                    },
                    restaurant: {
                        select: {
                            address: true,
                            country: {
                                select: {
                                    currencyCode: true
                                }
                            }
                        },

                    }
                },
            });

            return orderCheckout.map((checkout) => ({
                id: checkout.id,
                currencyCode: checkout.restaurant.country.currencyCode,
                customerId: checkout.customerId,
                restaurantId: checkout.restaurantId,
                orderId: checkout.orderId,
                statusLabel: getStatusLabel(checkout.status),
                status: checkout.status,
                btnColor: getButtonColor(checkout.status),
                address: checkout.addressId ? checkout.address : checkout.restaurant.address,
                totalPrice: checkout.menuOrders.reduce((sum, menuOrder) => sum + Number(menuOrder.menu.price), 0),
                paymentMethod: 'Cash',
                orderDate: checkout.createdAt,
                updatedDate: checkout.updatedAt,
                deliveryTime: checkout.addressId ? '10 mins' : '1 min',
                kilometer: '2.5 Km',
                paymentStatus: getPaymentStatusLabel(checkout.paymentStatus),
                orderItems: checkout.menuOrders.map(item => {
                    return {
                        menuName: item.menu.name,
                        image: getBaseUrl(req) + '/' + item.menu.image,
                        status: item.menu.status,
                        price: item.menu.price,
                        quantity: item.quantity,
                        orderId: item.orderId,
                        statusLabel: getStatusLabel(item.status),

                    }
                }),
            }));

        } catch (error) {
            this.logger.error(error);
            throw error
        }


    }
    async getOrdersInKitchen(req: Request, restaurantId: number, status: number) {
        try {
            const orderCheckout = await this.prisma.orderCheckout.findMany({
                where: this.orderInKitchenQuery(restaurantId, status),
                orderBy: [{
                    createdAt: 'desc',
                }, {
                    status: 'asc'
                }],
                include: {
                    menuOrders: {
                        select: {
                            id: true,
                            orderId: true,
                            status: true,
                            quantity: true,
                            menu: {
                                select: {
                                    name: true,
                                    price: true,
                                    image: true,
                                    status: true,
                                }
                            }
                        }
                    },
                    address: {
                        select: {
                            name: true,
                            label: true,
                            latitude: true,
                            longitude: true
                        }
                    },
                    restaurant: {
                        select: {
                            address: true,
                            country: {
                                select: {
                                    currencyCode: true
                                }
                            }
                        }
                    }
                },
            });

            return orderCheckout.map((checkout) => ({
                id: checkout.id,
                customerId: checkout.customerId,
                restaurantId: checkout.restaurantId,
                orderId: checkout.orderId,
                statusLabel: getStatusLabelForOrdersInKitchen(checkout.status),
                status: checkout.status,
                btnColor: getButtonColor(checkout.status),
                address: checkout.addressId ? checkout.address : checkout.restaurant.address,
                totalPrice: checkout.menuOrders.reduce((sum, menuOrder) => sum + Number(menuOrder.menu.price), 0),
                paymentMethod: 'Cash',
                orderDate: checkout.createdAt,
                updatedDate: checkout.updatedAt,
                deliveryTime: checkout.addressId ? '10 mins' : '1 min',
                kilometer: '2.5 Km',
                paymentStatus: getPaymentStatusLabel(checkout.paymentStatus),
                orderItems: checkout.menuOrders.map(item => {
                    return {
                        menuName: item.menu.name,
                        image: getBaseUrl(req) + '/' + item.menu.image,
                        status: item.menu.status,
                        price: item.menu.price,
                        quantity: item.quantity,
                        orderId: item.orderId,
                        statusLabel: getStatusLabel(item.status),

                    }
                }),
            }));

        } catch (error) {
            this.logger.error(error);
            throw error
        }


    }
    async customerOrdersLiveSearch(req: Request, restaurantId: number, searchString: string) {
        try {
            const orderCheckout = await this.prisma.orderCheckout.findMany({
                where: {
                    restaurantId: restaurantId,
                },
                orderBy: [{
                    createdAt: 'desc',
                }, {
                    status: 'asc'
                }],
                include: {
                    menuOrders: {
                        where: {
                            menu: {
                                OR: [
                                    { name: { contains: searchString } },
                                    { description: { contains: searchString } },
                                    // { dietaryInformation: { contains: searchString } },
                                    // { price: { equals: parseFloat(searchString) } },
                                    // { id: { equals: parseInt(searchString) } },
                                    { dietaryInformation: { contains: searchString } },
                                ]
                            }
                        },
                        select: {
                            id: true,
                            orderId: true,
                            status: true,
                            quantity: true,
                            menu: {
                                select: {
                                    name: true,
                                    price: true,
                                    image: true,
                                    status: true,
                                },
                            }
                        }
                    },
                    address: {
                        select: {
                            name: true,
                            label: true,
                            latitude: true,
                            longitude: true
                        }
                    },
                    restaurant: {
                        select: {
                            address: true
                        }
                    }
                },
            });

            return orderCheckout.filter(d => d.menuOrders.length > 0).map((checkout) => ({
                id: checkout.id,
                customerId: checkout.customerId,
                restaurantId: checkout.restaurantId,
                orderId: checkout.orderId,
                statusLabel: getStatusLabel(checkout.status),
                status: checkout.status,
                btnColor: getButtonColor(checkout.status),
                address: checkout.addressId ? checkout.address : checkout.restaurant.address,
                totalPrice: checkout.menuOrders.reduce((sum, menuOrder) => sum + Number(menuOrder.menu.price), 0),
                paymentMethod: 'Cash',
                orderDate: checkout.createdAt,
                updatedDate: checkout.updatedAt,
                deliveryTime: checkout.addressId ? '10 mins' : '1 min',
                kilometer: '2.5 Km',
                paymentStatus: getPaymentStatusLabel(checkout.paymentStatus),
                orderItems: checkout.menuOrders.map(item => {
                    return {
                        menuName: item.menu.name,
                        // image: getBaseUrl(req) + '/' + item.menu.image,
                        status: item.menu.status,
                        price: item.menu.price,
                        quantity: item.quantity,
                        orderId: item.orderId,
                        statusLabel: getStatusLabel(item.status),

                    }
                }),
            }));



        } catch (error) {
            this.logger.error(error);
            throw error
        }


    }
    async acceptOrder(restaurantId: number, checkoutOrderId: number) {
        try {
            const orderCheckout = await this.prisma.orderCheckout.findFirst({
                where: {
                    restaurantId: restaurantId,
                    id: checkoutOrderId,
                },
            });

            if (!orderCheckout) {
                throw new NotFoundException('Order not found')
            }

            if (orderCheckout.status != OrderStatus.CheckedOut) {
                throw new BadRequestException('Order Can only be accepted if the status is Checked Out')
            }

            const result = await this.prisma.orderCheckout.update({
                where: { id: orderCheckout.id }, data: {
                    status: OrderStatus.OrderAccepted
                }

            });
            this.socket.emitToClient(`get_orders_${restaurantId}`);
            this.socket.emitToClient(`get_orders_in_kitchen_${restaurantId}`);
            return result;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
    async cancelOrder(restaurantId: number, checkoutOrderId: number) {
        try {
            const orderCheckout = await this.prisma.orderCheckout.findFirst({
                where: {
                    restaurantId: restaurantId,
                    id: checkoutOrderId,
                },
            });

            if (!orderCheckout) {
                throw new NotFoundException('Order not found')
            }

            const result = await this.prisma.orderCheckout.update({
                where: { id: orderCheckout.id }, data: {
                    status: OrderStatus.Cancelled
                }

            })
            this.socket.emitToClient(`get_orders_${restaurantId}`);
            this.socket.emitToClient(`get_orders_in_kitchen_${restaurantId}`);
            return result;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
    async rejectOrder(restaurantId: number, checkoutOrderId: number) {
        try {
            const orderCheckout = await this.prisma.orderCheckout.findFirst({
                where: {
                    restaurantId: restaurantId,
                    id: checkoutOrderId,
                },
            });

            if (!orderCheckout) {
                throw new NotFoundException('Order not found')
            }
            await this.prisma.orderCheckout.update({
                where: { id: orderCheckout.id }, data: {
                    status: OrderStatus.Rejected
                }

            });
            this.socket.emitToClient(`get_orders_${restaurantId}`);
            this.socket.emitToClient(`get_orders_in_kitchen_${restaurantId}`);
            return orderCheckout;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
    async reinstateOrder(restaurantId: number, checkoutOrderId: number) {
        try {
            const orderCheckout = await this.prisma.orderCheckout.findFirst({
                where: {
                    restaurantId: restaurantId,
                    id: checkoutOrderId,
                },
            });

            if (!orderCheckout) {
                throw new NotFoundException('Order not found')
            }
            const result = await this.prisma.orderCheckout.update({
                where: { id: orderCheckout.id }, data: {
                    status: OrderStatus.OrderAccepted
                }

            });
            this.socket.emitToClient(`get_orders_${restaurantId}`);
            this.socket.emitToClient(`get_orders_in_kitchen_${restaurantId}`);
            return result;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
    async prepapreOrder(restaurantId: number, checkoutOrderId: number) {
        try {
            const orderCheckout = await this.prisma.orderCheckout.findFirst({
                where: {
                    restaurantId: restaurantId,
                    id: checkoutOrderId,
                },
            });

            if (!orderCheckout) {
                throw new NotFoundException('Order not found')
            }
            const result = await this.prisma.orderCheckout.update({
                where: { id: orderCheckout.id }, data: {
                    status: OrderStatus.Packaged
                }

            });
            this.socket.emitToClient(`get_orders_${restaurantId}`);
            this.socket.emitToClient(`get_orders_in_kitchen_${restaurantId}`);
            return result;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
