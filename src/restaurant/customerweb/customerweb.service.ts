import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { GatewayService } from 'src/gateway/gateway.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusMessage } from '../enums';

@Injectable()
export class CustomerWebService {
  constructor(
    private prisma: PrismaService,
    private socket: GatewayService,
  ) {}

  async getRestaurantMenuCategories(restaurantId: string) {
    const categories = (await this.prisma.menuCategory.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        deleted: false
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    }));
    return categories;
  }

  async getRestaurantMenuByCategoryId(restaurantId: string, categoryId: string) {
    try {
      const menuList = await this.prisma.menu.findMany({
        where: {
          menuCategoryId: parseInt(categoryId),
          restaurantId: parseInt(restaurantId),
          deleted: false
        },
        include: {
          menuCategory: true,
        }
      });
      return  menuList;
    } catch (error) {
      throw error
    }
  }

  async getRestaurantMenuById(restaurantId: string, menuId: string) {
    try {
      const menu = await this.prisma.menu.findFirst({
        where: {
          restaurantId: parseInt(restaurantId),
          id: parseInt(menuId),
          deleted: false
        },
        include: {
          menuCategory: true,
        }
      });
      if (!menu) {
        throw new NotFoundException(StatusMessage.NoRecord);
      }

      return menu;
    } catch (error) {
      throw error
    }
  }

  async getRestaurantMenuByName(restaurantId: string, name: string) {
    try {
      const menu = await this.prisma.menu.findFirst({
        where: {
          restaurantId: parseInt(restaurantId),
          name: { 
            contains: name
          },
          deleted: false
        },
        include: {
          menuCategory: true,
        }
      });
      if (!menu) {
        throw new NotFoundException(StatusMessage.NoRecord);
      }

      return menu;
    } catch (error) {
      throw error
    }
  }

  async getRestaurantAllMenu(restaurantId: string) {
    const restaurant_menu = (await this.prisma.menu.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        deleted: false
      },
      include: {
        menuCategory: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    }));
    return restaurant_menu;
  }
}
