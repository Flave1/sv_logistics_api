import {
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRestaurantDto,
  EditRestaurantDto,
} from './dto';
import { RedisRepository } from 'src/redis/redis.repository';
import { Restaurant } from '@prisma/client';
import { PaymentStatus, deleteFile, fileExist } from "src/utils";
import { DeleteDto } from 'src/dto/delete.dto';
import { APIResponse } from 'src/dto/api-response';
import { OrderStatus, Status, StatusMessage } from './enums';
import { GatewayService } from 'src/gateway/gateway.service';
import { RestaurantManagementEvents } from 'src/gateway/dto';
import { CreateQrCodeDto, QrcodeResponse } from './dto/qrcode.dto';
import { Request } from 'express';
import * as qrcode from 'qrcode';

export const cached_restaurants = 'cached_restaurants';
@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService,
    // private redis: RedisRepository
    private socket: GatewayService
  ) { }

  getRestaurantById(restaurantId: number) {
    return this.prisma.restaurant.findFirst({
      where: {
        id: restaurantId
      },
    });
  }

  async getRestaurants() {
    // const cachedData = await this.redis.getAll<Restaurant[]>(cached_restaurants);
    // if (cachedData) {
    //     console.log('gotten from cache');
    //     return cachedData;
    // }

    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        deleted: false
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    });
    // await this.redis.store<Restaurant[]>({ key: cached_restaurants, data: restaurants });
    // console.log('gotten from db');
    return restaurants;
  }

  async createRestaurant(dto: CreateRestaurantDto, file: Express.Multer.File) {
    const hasFreeDelivery = dto.hasFreeDelivery.toString().toLowerCase() == 'true' ? true : false;
    const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
    const restaurant =
      await this.prisma.restaurant.create({
        data: {
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          address: dto.address,
          description: dto.description,
          email: dto.email,
          image: file.path,
          openingTime: dto.openingTime,
          closingTime: dto.closingTime,
          hasFreeDelivery: hasFreeDelivery,
          freeDeliveryAmount: dto.freeDeliveryAmount,
          status: status,
          deleted: false,
          clientId: parseInt(dto.clientId),
          latitude: dto.latitude,
          longitude: dto.longitude,
          countryId: parseInt(dto.countryId)
        },
      });
    // await this.redis.updateList(cached_restaurants, restaurant);
    this.socket.emitToClient(RestaurantManagementEvents.get_restaurants_event)
    return restaurant;
  }




  async editRestaurantById(
    dto: EditRestaurantDto,
    file: Express.Multer.File
  ) {
    const restaurant =
      await this.prisma.restaurant.findUnique({
        where: {
          id: parseInt(dto.id),
          deleted: false
        },
      });

    if (!restaurant)
      throw new NotFoundException('Item not found');


    if (file && await fileExist(restaurant.image)) {
      await deleteFile(restaurant.image)
    }
    const hasFreeDelivery = dto.hasFreeDelivery.toString().toLowerCase() == 'true' ? true : false;
    const status = dto.status.toString().toLowerCase() == 'true' ? true : false;

    this.socket.emitToClient(RestaurantManagementEvents.get_restaurants_event)
    return this.prisma.restaurant.update({
      where: {
        id: parseInt(dto.id),
      },
      data: {
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        address: dto.address,
        description: dto.description,
        email: dto.email,
        image: file.path,
        openingTime: dto.openingTime,
        closingTime: dto.closingTime,
        hasFreeDelivery: hasFreeDelivery,
        freeDeliveryAmount: dto.freeDeliveryAmount,
        status: status,
        latitude: dto.latitude,
        longitude: dto.longitude,
        countryId: parseInt(dto.countryId)
      },
    });
  }

  async deleteRestaurantById(dto: DeleteDto) {
    try {
      const restaurant =
        await this.prisma.restaurant.updateMany({
          where: {
            id: {
              in: dto.id.map(id => parseInt(id)),
            }
          },
          data: {
            deleted: true
          },
        });
      this.socket.emitToClient(RestaurantManagementEvents.get_restaurants_event)
      return new APIResponse(Status.Success, StatusMessage.Deleted, null);
    } catch (error) {
      throw error;
    }
  }

  async CreateQrCode(restaurantId: string, dto: CreateQrCodeDto, @Req() req: Request) {
    //Fetch restaurant details by restaurantId
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id: parseInt(restaurantId),
      },
    });

    let menuPage;
    let qrCodes: QrcodeResponse[] = [];
    if (dto.table.length == 0) {
      menuPage = `${dto.clientUrl}/${restaurant.name.replace(" ", "-")}/${restaurantId}/menu`;
      const base64Image = await this.generateQrCodeImage(menuPage);
      qrCodes.push({ table: '', qrcode: base64Image })
    } else {
      for (let i = 0; i < dto.table.length; i++) {
        menuPage = `${dto.clientUrl}/${restaurant.name.replace(" ", "-")}/${restaurantId}/menu/${dto.table[i]}`;
        const base64Image = await this.generateQrCodeImage(menuPage);
        qrCodes.push({ table: dto.table[i], qrcode: base64Image })
      }
    }
    return qrCodes;
  }
  private async generateQrCodeImage(text: string): Promise<string> {
    return qrcode.toDataURL(text);
  }

  async getDasboardStats(restaurantId: number) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { id: restaurantId },
      include: {
        country: {
          select: {
            currencyCode: true
          }
        },
      }
    });

    const menuOrder = await this.prisma.menuOrder.findMany({
      where: { id: restaurantId },
      include: {
        OrderCheckout: {

        },
        menu: {
          select: {
            price: true
          }
        }
      }
    });

    return {
      currency: restaurant.country.currencyCode,
      totalIncome: menuOrder.filter(f => f.OrderCheckout.status !== OrderStatus.CheckedOut)
        .filter(d => d.OrderCheckout !== null).reduce((sum, order) => sum + Number(order.menu.price), 0),

      income: menuOrder.filter(f => f.OrderCheckout.paymentStatus == PaymentStatus.success)
        .filter(d => d.OrderCheckout !== null).reduce((sum, order) => sum + Number(order.menu.price) * order.quantity, 0),
      expense: 0,

      completedOrder: menuOrder.filter(f => f.OrderCheckout.status == OrderStatus.Packaged)
        .filter(d => d.OrderCheckout !== null).length,

      delivered: menuOrder.filter(f => f.OrderCheckout.status == OrderStatus.Delivered)
        .filter(d => d.OrderCheckout !== null).length,

      canceled: menuOrder.filter(f => f.OrderCheckout.status == OrderStatus.Cancelled)
        .filter(d => d.OrderCheckout !== null).length,

      pending: menuOrder.filter(f => f.OrderCheckout.status == OrderStatus.Pending)
        .filter(d => d.OrderCheckout !== null).length
    }
  }
}