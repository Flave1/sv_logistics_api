import { Injectable, NotFoundException } from "@nestjs/common";
import { GatewayService } from "src/gateway/gateway.service";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusMessage, OrderStatus } from "../enums";
import { CreateMenuOrderDto } from "./dto/create-menu-order.dto";


@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService, private socket: GatewayService) { }


  async getRestaurantMenuById(menuId: string) {
    try {
      const menu = await this.prisma.menu.findFirst({
        where: {
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

  async getRestaurantMenuCategories(restaurantId: string) {
    const categories = (await this.prisma.menuCategory.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        deleted: false
      },
      select: {
        id: true,
        name: true,
        restaurantId: true,
      }
    }));
    return categories;
  }

  async getRestaurantMenuByCategoryId(categoryId: string) {
    try {
      const menuList = await this.prisma.menu.findMany({
        where: {
          menuCategoryId: parseInt(categoryId),
          deleted: false
        }
      });
      return  menuList;
    } catch (error) {
      throw error
    }
  }

  async getRestaurantById(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
        where: {
            id: parseInt(restaurantId),
            deleted: false
        },
    });

    if(!restaurant) {
        throw new NotFoundException(StatusMessage.NoRecord);
    }

    return restaurant
  }

  async getRestaurants() {
    const restaurants = await this.prisma.restaurant.findMany({
        where: {
            deleted: false
        },
      }
    );
    return restaurants;
}

async getRestaurantMenu(restaurantId: string) {
    const menus = await this.prisma.menu.findMany({
        where: {
          restaurantId: parseInt(restaurantId),
          deleted: false
        },
        include: {
          MenuOrders: {
            where: {
                status: OrderStatus.Completed,
                createdAt: {
                    gte: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // Orders within the last 3 days
                  }
              },
              orderBy: {
                createdAt: 'desc'
            }
          },
        },
        take: 20
      });

    const orderedMenus = menus.sort((menuA, menuB) => {
    const sumA = menuA.MenuOrders.reduce((total, order) => total + order.quantity, 0);
    const sumB = menuB.MenuOrders.reduce((total, order) => total + order.quantity, 0);
    return sumB - sumA;
    });
    
    const mostOrderedMenu = orderedMenus.map((menu) => ({
      ...menu,
      MenuOrders: undefined
    }))
    return mostOrderedMenu;
}

async getPopularMenu() {
    const menus = await this.prisma.menu.findMany({
        where: {
          deleted: false,
        },
        distinct: ['restaurantId'],
        include: {
          MenuOrders: {
            where: {
                status: OrderStatus.Completed,
                createdAt: {
                    gte: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // Orders within the last 3 days
                  }
              },
              orderBy: {
                createdAt: 'desc'
            },
            take: 1
          },
          restaurant: true
        },
        take: 20
      });

    const orderedMenus = menus.sort((menuA, menuB) => {
    const sumA = menuA.MenuOrders.reduce((total, order) => total + order.quantity, 0);
    const sumB = menuB.MenuOrders.reduce((total, order) => total + order.quantity, 0);
    return sumB - sumA;
    });
    
    const mostOrderedMenu = orderedMenus.map((menu) => ({
      ...menu,
      MenuOrders: undefined
    }))
    return mostOrderedMenu;
}


async CreateMenuOrder(dto: CreateMenuOrderDto) {
    const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
    const menuOrder = await this.prisma.menuOrder.create({
      data: {
        customerId: parseInt(dto.customerId),
        restaurantId: parseInt(dto.restaurantId),
        menuId: parseInt(dto.menuId),
        quantity: parseInt(dto.quantity),
        deleted: false,
        status: dto.status
      },
    });
    return menuOrder;
  }

}

