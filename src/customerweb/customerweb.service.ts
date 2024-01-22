import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { GatewayService } from 'src/gateway/gateway.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusMessage } from '../restaurant/enums';
import { Request } from 'express';
import { getBaseUrl } from 'src/utils';

@Injectable()
export class CustomerWebService {
  constructor(
    private prisma: PrismaService,
    private socket: GatewayService,
  ) { }

  async getRestaurantAllMenu(restaurantId: string, req: Request) {
    const restaurant_menu = (await this.prisma.menu.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        deleted: false
      },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        }, menuCategory: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    }));

    return restaurant_menu.map((menu) => ({
      name: menu.name,
      description: menu.description,
      restaurantId: menu.restaurantId,
      restaurantName: menu.restaurant.name,
      categoryName: menu.menuCategory.name,
      id: menu.id,
      image: getBaseUrl(req) + '/' + menu.image,
      price: menu.price,
      availability: menu.availability,
      discount: menu.discount,
      dietaryInformation: menu.dietaryInformation,
    }));
  }
}
