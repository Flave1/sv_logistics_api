import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRestaurantDto,
  EditRestaurantDto,
} from './dto';
import { PaymentStatus, deleteFile, fileExist } from "src/utils";
import { DeleteDto } from 'src/dto/delete.dto';
import { APIResponse } from 'src/dto/api-response';
import { OrderStatus, Status, StatusMessage, admin_permossions } from './enums';
import { GatewayService } from 'src/gateway/gateway.service';
import { CreateQrCodeDto, QrcodeResponse } from './dto/qrcode.dto';
import { Request } from 'express';
import * as qrcode from 'qrcode';
import { AuthService } from 'src/auth/auth.service';
import { CreateStaffDto } from 'src/auth/dto/create.staff.dto';
import { UserService } from './user/user.service';
import { EditUserDto } from './user/dto';
import { UserType } from './user/enums';

export const cached_restaurants = 'cached_restaurants';
@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService,
    // private redis: RedisRepository
    private socket: GatewayService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  async getRestaurantById(clientId: number) {
    return await this.prisma.user.findFirst({
      where: {
        id: clientId,
        userTypeId: UserType.Client,
        deleted: false,
        NOT: [
          { restaurantId: null }
        ]
      },
      select: {
        firstName: true,
        lastName: true,
        id: true,
        restaurant: true
      }
    });
  }

  async sys_getRestaurants() {
    const restaurants = await this.prisma.user.findMany({
      where: {
        userTypeId: UserType.Client,
        deleted: false,
        NOT: [{ restaurantId: null }]
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ],
      select: {
        firstName: true,
        lastName: true,
        id: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            status: true,
            createdAt: true,
            image: true
          }
        }
      }
    });
    return restaurants;
  }

  async getClientRestaurants(clientId: number) {
    const restaurants = await this.prisma.user.findMany({
      where: {
        userTypeId: UserType.Client,
        deleted: false,
        NOT: [{ restaurantId: null }],
        restaurant: {
          clientId
        }
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ],
      select: {
        firstName: true,
        lastName: true,
        id: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            status: true,
            createdAt: true,
            image: true
          }
        }
      }
    });
    return restaurants;
  }

  async getRestaurants() {
    const restaurants = await this.prisma.user.findMany({
      where: {
        userTypeId: UserType.Client,
        deleted: false,
        NOT: [{ restaurantId: null }]
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ],
      select: {
        firstName: true,
        lastName: true,
        id: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            status: true,
            createdAt: true,
            image: true
          }
        }
      }
    });
    return restaurants;
  }

  async createRestaurant(dto: CreateRestaurantDto, file: Express.Multer.File) {

    try {
      await this.prisma.$transaction(async (tx) => {
        const hasFreeDelivery = dto.hasFreeDelivery.toString().toLowerCase() == 'true' ? true : false;
        const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
        const restaurant = await tx.restaurant.create({
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

        if (restaurant.id > 0) {
          const staffAccount: CreateStaffDto = {
            address: restaurant.address,
            email: restaurant.email,
            firstName: dto.staffFirstname,
            lastName: dto.staffLastname,
            phoneNumber: dto.phoneNumber,
          }

          await this.authService.CreateStaff(restaurant.id.toString(), staffAccount, tx, admin_permossions)
        }

        this.socket.emitToClient(`get_restaurants_event`)
        return restaurant;
      })
    } catch (error) {
      throw new InternalServerErrorException(error)
    } finally {
      await this.prisma.$disconnect()
    }


  }

  async editRestaurantById(dto: EditRestaurantDto, file: Express.Multer.File) {
    const restaurant =
      await this.prisma.restaurant.findUnique({
        where: {
          id: parseInt(dto.id),
          deleted: false
        },
      });

    if (!restaurant)
      throw new NotFoundException('Item not found');

    const user = await this.userService.getUserByEmail(restaurant.email);
    if (!user) {
      throw new NotFoundException("User not found")
    }


    if (file && await fileExist(restaurant.image)) {
      await deleteFile(restaurant.image)
    }
    const hasFreeDelivery = dto.hasFreeDelivery.toString().toLowerCase() == 'true' ? true : false;
    const status = dto.status.toString().toLowerCase() == 'true' ? true : false;

    const editedRest = await this.prisma.restaurant.update({
      where: {
        id: parseInt(dto.id),
      },
      data: {
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        address: dto.address,
        description: dto.description,
        email: dto.email,
        image: file ? file.path : restaurant.image,
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

    if (restaurant.id > 0) {
      const staffAccount: EditUserDto = {
        address: restaurant.address,
        email: dto.email,
        firstName: dto.staffFirstname,
        lastName: dto.staffLastname,
        phoneNumber: dto.phoneNumber,
      }
      await this.userService.updateStaffUser(user.id, staffAccount, restaurant.id.toString())
    }

    this.socket.emitToClient(`get_restaurants_event`)
    return editedRest;
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
      this.socket.emitToClient(`get_restaurants_event`)
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
        const base64Image = await this.generateQrCodeImage(menuPage.toLowerCase());
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
      select: {
        country: {
          select: {
            currencyCode: true
          }
        },
      }
    });

    const menuOrder = await this.prisma.menuOrder.findMany({
      where: { restaurantId: restaurantId },
      select: {
        quantity: true,
        status: true,
        OrderCheckout: {
          select: {
            status: true,
            paymentStatus: true
          }
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
      totalIncome: menuOrder.filter(f => f.OrderCheckout?.status !== OrderStatus.CheckedOut)
        .filter(d => d.OrderCheckout !== null).reduce((sum, order) => sum + Number(order.menu.price), 0),

      income: menuOrder.filter(f => f.OrderCheckout?.paymentStatus == PaymentStatus.success)
        .filter(d => d.OrderCheckout !== null).reduce((sum, order) => sum + Number(order.menu.price) * order.quantity, 0),
      expense: 0,

      packaged: menuOrder.filter(f => f.OrderCheckout?.status == OrderStatus.Packaged)
        .filter(d => d.OrderCheckout !== null).length,

      delivered: menuOrder.filter(f => f.OrderCheckout?.status == OrderStatus.Delivered)
        .filter(d => d.OrderCheckout !== null).length,

      canceled: menuOrder.filter(f => f.OrderCheckout?.status == OrderStatus.Cancelled)
        .filter(d => d.OrderCheckout !== null).length,

      pending: menuOrder.filter(f => f?.status == OrderStatus.Pending).length
    }
  }
}