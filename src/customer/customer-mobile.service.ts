import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { GatewayService } from "src/gateway/gateway.service";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusMessage, OrderStatus } from "../restaurant/enums";
import { RemoveMenuOrderDto, SaveMenuOrderDto } from "./dto/create-menu-order.dto";
import { getBaseUrl, getStatusLabel } from "src/utils";
import { Request } from 'express';
import { Menu } from "@prisma/client";


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
      return menuList;
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

    if (!restaurant) {
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


  async addToCartOrUpdate(dto: SaveMenuOrderDto) {
    try {
      const existingMenuOrder = await this.prisma.menuOrder.findFirst({
        where: {
          menuId: dto.menuId,
          // Use either customerId or temporalId, whichever is available
          OR: [
            { customerId: dto.customerId },
            { temporalId: dto.temporalId },
          ],
        },
      });

      if (existingMenuOrder) {
        // If the menu order already exists, update it
        const updatedMenuOrder = await this.prisma.menuOrder.update({
          where: { id: existingMenuOrder.id },
          data: {
            quantity: existingMenuOrder.quantity + dto.quantity,
            // Add any other fields you want to update
            // ...
          },
        });

        return updatedMenuOrder;
      } else {
        // If the menu order does not exist, create a new one
        const newMenuOrder = await this.prisma.menuOrder.create({
          data: {
            customerId: dto.customerId ? dto.customerId : null,
            restaurantId: dto.restaurantId,
            menuId: dto.menuId,
            quantity: dto.quantity,
            deleted: false,
            status: OrderStatus.Pending,
            temporalId: dto.temporalId,
          },
        });

        return newMenuOrder;
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
  async removefromCart(dto: RemoveMenuOrderDto) {
    try {
      const existingMenuOrder = await this.prisma.menuOrder.findFirst({
        where: {
          menuId: dto.menuId,
          OR: [
            { customerId: dto.customerId },
            { temporalId: dto.temporalId },
          ],
        },
      });

      if (existingMenuOrder) {
        if (existingMenuOrder.quantity == 1) {
          await this.prisma.menuOrder.delete({ where: { id: existingMenuOrder.id } })
          return { message: "Menu completely removed from Cart"};
        }
        // If the menu order already exists, update it
        const updatedMenuOrder = await this.prisma.menuOrder.update({
          where: { id: existingMenuOrder.id },
          data: {
            quantity: existingMenuOrder.quantity - 1,
          },
        });

        return updatedMenuOrder;
      }else{
        return { message: "Menu does not exist in  Cart"};
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getFromCart(req: Request, customerId?: number, temporalId?: string) {
    try {
      const menuOrders = await this.prisma.menuOrder.findMany({
        where: {
          OR: [
            { customerId: customerId },
            { temporalId: temporalId },
          ],
          deleted: false,
          status: OrderStatus.Pending,
        },
        include: {
          menu: {
            select: {
              name: true,
              price: true,
              image: true
            },
          },
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      });

      return menuOrders.map((order) => ({
        customerId: order.customerId,
        temporalId: order.temporalId,
        restaurantId: order.restaurantId,
        restaurantName: order.restaurant.name,
        menuId: order.menuId,
        menuName: order.menu.name,
        image: getBaseUrl(req) + '/' + order.menu.image,
        quantity: order.quantity,
        status: order.status,
        price: order.menu.price,
        statusLabel: getStatusLabel(order.status),
      }));
    } catch (error) {

    }


  }

  async getCheckoutMenu(restaurantIds: number[], menuIds: number[], req: Request) {
    const menus = await this.prisma.menu.findMany({
      where: {
        restaurantId: {
          in: restaurantIds,
        },
        OR: [
          {
            AND: [
              {
                NOT: {
                  id: {
                    in: menuIds,
                  },
                },
              },
              // {
              //   menuCategoryId: categoryId,
              // },
            ],
          },
        ],
      },
      take: 5,
    });
    return menus.map((mn: Menu) => ({
      restaurantId: mn.restaurantId,
      id: mn.id,
      name: mn.name,
      price: mn.price,
      image: getBaseUrl(req) + '/' + mn.image
    }))
  }

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

