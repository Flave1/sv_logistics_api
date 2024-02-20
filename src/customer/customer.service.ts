import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { GatewayService } from "src/gateway/gateway.service";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusMessage, OrderStatus } from "../restaurant/enums";
import { RemoveMenuOrderDto, SaveMenuOrderDto } from "./dto/create-menu-order.dto";
import { PaymentOption, PaymentStatus, getBaseUrl, getStatusLabel } from "src/utils";
import { Request } from 'express';
import { Menu, User } from "@prisma/client";
import { CheckoutDto } from "./dto";
import { UserService } from "src/restaurant/user/user.service";


@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService, private socket: GatewayService, private userService: UserService) { }


  private readonly logger = new Logger(GatewayService.name);
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
            status: OrderStatus.CheckedOut,
            createdAt: {
              gte: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // Orders within the last 3 days
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        restaurant: {
          select: {
            country: {
              select: {
                currencyCode: true
              }
            }
          }
        }
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
            status: OrderStatus.CheckedOut,
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

  async getPopularMenuV1(req: Request) {
    const menu = await this.prisma.restaurant.findMany({
      where: {
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        status: true,
        image: true,
        phoneNumber: true,
        address: true,
        openingTime: true,
        closingTime: true,
        hasFreeDelivery: true,
        freeDeliveryAmount: true,
        latitude: true,
        longitude: true,
        menu: {
          select: {
            id: true,
            image: true,
            name: true,
          },
          take: 1
        }
      },
      take: 20
    });

    return menu.filter(r => r.menu.length > 0).map((res) => ({
      id: res.id,
      name: res.name,
      image: getBaseUrl(req) + '/' + res.image,
      status: res.status,
      phoneNumber: res.phoneNumber,
      address: res.address,
      openingTime: res.openingTime,
      closingTime: res.closingTime,
      hasFreeDelivery: res.hasFreeDelivery,
      freeDeliveryAmount: res.freeDeliveryAmount,
      latitude: res.latitude,
      longitude: res.longitude,
      menuImage: res.menu[0]?.image ? getBaseUrl(req) + '/' + res.menu[0]?.image : "",
      menuName: res.menu[0]?.name ?? "",
      menuId: res.menu[0]?.id ?? ""
    }));
  }

  async addToCartOrUpdate(dto: SaveMenuOrderDto) {
    try {
      const existingMenuOrder = await this.prisma.menuOrder.findFirst({
        where: {
          menuId: dto.menuId,
          status: OrderStatus.Pending,
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
          status: OrderStatus.Pending,
          OR: [
            { customerId: dto.customerId },
            { temporalId: dto.temporalId },
          ],
        },
      });

      if (existingMenuOrder) {
        if (existingMenuOrder.quantity == 1) {
          await this.prisma.menuOrder.delete({ where: { id: existingMenuOrder.id } })
          return { message: "Menu completely removed from Cart" };
        }
        // If the menu order already exists, update it
        const updatedMenuOrder = await this.prisma.menuOrder.update({
          where: { id: existingMenuOrder.id },
          data: {
            quantity: existingMenuOrder.quantity - 1,
          },
        });

        return updatedMenuOrder;
      } else {
        return { message: "Menu does not exist in  Cart" };
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
              country: {
                select: {
                  currencyCode: true
                }
              }
            },
          },
        },
      });

      return menuOrders.map((order) => ({
        customerId: order.customerId,
        currencyCode: order.restaurant.country.currencyCode,
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
            country: {
              select: {
                currencyCode: true
              }
            }
          },
        },
        menuCategory: {
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
      currencyCode: menu.restaurant.country.currencyCode,
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

  async checkoutOrder(request: CheckoutDto) {
    try {
      let customer = null;

      if (request.customerId > 0) {
        customer = await this.userService.getUserById(request.customerId);
      }
      if (request.paymentOption != PaymentOption.payAtRestaurant) {
        if (!customer) {
          throw new UnauthorizedException('Authentication is required')
        }
      }

      const menus = await this.prisma.menu.findMany({
        where: {
          id: { in: request.menuIds },
        },
      });

      if (request.menuIds.length !== menus.length) {
        throw new NotFoundException('One of the selected Order is not available')
      }
      const checkout = await this.createOrderCheckout(request, customer);
      const updatedOrders = await this.updateMenuOrders(request, checkout.id);

      this.socket.emitToClient(`get_orders_${request.restaurantId}`);
      return updatedOrders
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async createOrderCheckout(request: CheckoutDto, customer: any) {
    try {
      const orderCheckout = await this.prisma.orderCheckout.create({
        data: {
          menuIds: request.menuIds.join(','),
          paymentStatus: PaymentStatus.success,
          addressId: customer && customer.addresses && customer.addresses.map(user => user).id,
          customerId: customer && request.customerId,
          orderId: (await this.generateOrderCheckoutId(request.restaurantId)).toString(),
          status: OrderStatus.CheckedOut,
          restaurantId: request.restaurantId
        }
      });
      return orderCheckout
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async updateMenuOrders(request: CheckoutDto, checkoutId: number) {
    try {
      const menuOrder = await this.prisma.menuOrder.updateMany({
        where: {
          OR: [
            { customerId: request.customerId },
            { temporalId: request.temporalId },
          ],
          status: OrderStatus.Pending,
        },
        data: {
          orderId: (await this.generateMenuOrderId(request.restaurantId)).toString(),
          status: OrderStatus.CheckedOut,
          orderCheckoutId: checkoutId
        },
      });
      return menuOrder;
    } catch (error) {
      throw error
    }
  }

  async generateOrderCheckoutId(restuarantId: number) {
    const lastOrderId = await this.prisma.orderCheckout.findFirst({
      where: {
        restaurantId: restuarantId
      },
      select: {
        id: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    const traxId = lastOrderId ? lastOrderId.id + 1 : 1;
    return traxId
  }

  async generateMenuOrderId(restuarantId: number) {
    const lastOrderId = await this.prisma.menuOrder.findFirst({
      where: {
        restaurantId: restuarantId
      },
      select: {
        id: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return lastOrderId ? lastOrderId.id + 1 : 1;
  }

  async customerMenuLiveSearch(req: Request, restaurantId: number, searchString: string) {
    try {
      const menu = await this.prisma.menu.findMany({
        where: {
          restaurantId: restaurantId,
          OR: [
            { name: { contains: searchString } },
            { description: { contains: searchString } },
            { dietaryInformation: { contains: searchString } },
          ]
        },
        select: {
          id: true,
          name: true,
          image: true
        }
      });

      return menu.map((mn) => ({
        id: mn.id,
        name: mn.name,
        image: getBaseUrl(req) + '/' + mn.image,
      }));
    } catch (error) {
      this.logger.error(error);
      throw error
    }
  }
}


