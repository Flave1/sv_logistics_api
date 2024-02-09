import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { GatewayService } from "src/gateway/gateway.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMenuCategoryDto } from "./dto/create.menu-category.dto";
import { APIResponse } from "../../dto/api-response";
import { Status } from "../enums/status-code.enum";
import { DeleteDto } from "src/dto/delete.dto";
import { StatusMessage } from "../enums/status-message.enum";
import { UpdateMenuCategoryDto } from "./dto/update.menu-category.dto";
import { CreateMenuDto } from "./dto/create.menu.dto";
import { UpdateMenuDto } from "./dto/update.menu.dto";

import { MenuManagementEvents } from "src/gateway/dto";
import { deleteFile, fileExist, getRootDirectory } from "src/utils";
import { response } from "express";


@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService, private socket: GatewayService) { }

  async CreateRestaurantMenuCategory(restaurantId: string, file: Express.Multer.File, dto: CreateMenuCategoryDto) {
    const category = await this.prisma.menuCategory.findFirst({
      where: {
        restaurantId: parseInt(restaurantId),
        deleted: false,
        name: {
          equals: dto.name.toLowerCase()
        }
      },
    });
    if (category) {
      throw new BadRequestException(StatusMessage.Exist);
    }
    //Add new category
    const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
    const menuCategory = await this.prisma.menuCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        image: file.path,
        restaurantId: parseInt(restaurantId),
        deleted: false,
        status
      },
    });
    this.socket.emitToClient(`get_restaurant_menu_categories_event_${restaurantId}`)
    return menuCategory;
  }

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

  async getRestaurantMenuCategoryById(restaurantId: string, categoryId: string) {
    try {
      const category = await this.prisma.menuCategory.findFirst({
        where: {
          id: parseInt(categoryId),
          restaurantId: parseInt(restaurantId),
          deleted: false
        }
      });
      if (!category) {
        throw new NotFoundException(StatusMessage.NoRecord);
      }
      return category;
    } catch (error) {
      throw error
    }
  }

  async deleteRestaurantMenuCategoryById(restaurantId: string, dto: DeleteDto) {
    try {
      const categories = await this.prisma.menuCategory.findMany({
        where: {
          id: {
            in: dto.id.map(id => parseInt(id)),
          },
          restaurantId: parseInt(restaurantId)
        },
      });

      for (let i = 0; i < categories.length; i++) {
        const element = categories[i];
        if (await fileExist(element.image)) {
          await deleteFile(element.image)
        }
        await this.prisma.menuCategory.delete({ where: { id: element.id } })
      }

      this.socket.emitToClient(`get_restaurant_menu_categories_event_${restaurantId}`)
      return new APIResponse(Status.Success, StatusMessage.Deleted, null);
    } catch (error) {
      throw error;
    }
  }

  async updateRestaurantMenuCategory(restaurantId: string, file: Express.Multer.File, dto: UpdateMenuCategoryDto) {
    const category = await this.prisma.menuCategory.findFirst({
      where: {
        id: parseInt(dto.id),
        restaurantId: parseInt(restaurantId),
        deleted: false
      }
    });
    if (!category) {
      throw new NotFoundException(StatusMessage.NoRecord);
    }

    if (category.name.toLowerCase() == dto.name.toLowerCase() && category.id != parseInt(dto.id)) {
      throw new BadRequestException(StatusMessage.Exist)
    }

    if (file && await fileExist(category.image)) {
      await deleteFile(category.image)
    }

    const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
    const menuCategory = await this.prisma.menuCategory.update({
      where: {
        restaurantId: parseInt(restaurantId),
        id: parseInt(dto.id),
      },
      data: {
        name: dto.name,
        description: dto.description,
        image: file ? file.path : category.image,
        restaurantId: parseInt(restaurantId),
        deleted: false,
        status
      },
    });

    this.socket.emitToClient(`get_restaurant_menu_categories_event_${restaurantId}`)
    return menuCategory;
  }

  async CreateRestaurantMenu(restaurantId: string, file: Express.Multer.File, dto: CreateMenuDto) {
    try {

      //Check for existing menu
      const name = dto.name.toLowerCase()
      const _menu = await this.prisma.menu.findFirst({
        where: {
          restaurantId: parseInt(restaurantId),
          deleted: false,
          name: name
        },
      });

      if (_menu) {
        throw new BadGatewayException(StatusMessage.Exist);
      }

      //Add new menu
      const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
      const isAvailable = dto.availability.toString().toLowerCase() == 'true' ? true : false;
      const menu = await this.prisma.menu.create({
        data: {
          name: dto.name,
          description: dto.description,
          image: file.path,
          restaurantId: parseInt(restaurantId),
          menuCategoryId: parseInt(dto.menuCategoryId),
          price: dto.price,
          discount: dto.discount,
          dietaryInformation: dto.dietaryInformation,
          deleted: false,
          availability: isAvailable,
          status
        },
      });

      this.socket.emitToClient(`get_restaurant_menu_event_${restaurantId}`)
      return menu;

    } catch (error) {
      throw error;
    }
  }

  async getRestaurantMenu(restaurantId: string) {
    const restaurant_menu = (await this.prisma.menu.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        deleted: false
      },
      include: {
        menuCategory: {
          select: {
            name: true
          }
        },
        restaurant: {
          include: {
            country: {
              select: {
                currencyCode: true
              }
            }
          }
        }
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    }));
    return restaurant_menu;
  }

  async getRestaurantMenuById(restaurantId: string, menuId: string) {
    try {
      const menu = await this.prisma.menu.findFirst({
        where: {
          id: parseInt(menuId),
          restaurantId: parseInt(restaurantId),
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
      return menuList;
    } catch (error) {
      throw error
    }
  }


  async updateRestaurantMenu(restaurantId: string, file: Express.Multer.File, dto: UpdateMenuDto) {
    const menu = await this.prisma.menu.findFirst({
      where: {
        id: parseInt(dto.id),
        restaurantId: parseInt(restaurantId),
        deleted: false
      }
    });
    if (!menu) {
      throw new NotFoundException(StatusMessage.NoRecord);
    }

    if (menu.name.toLowerCase() == dto.name.toLowerCase() && parseInt(dto.id) != menu.id) {
      throw new BadRequestException(StatusMessage.Exist)
    }

    if (file && await fileExist(menu.image)) {
      await deleteFile(menu.image)
    }

    const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
    const availability = dto.availability.toString().toLowerCase() == 'true' ? true : false;
    await this.prisma.menu.update({
      where: {
        restaurantId: parseInt(restaurantId),
        id: parseInt(dto.id),
      },
      data: {
        name: dto.name,
        description: dto.description,
        image: file ? file.path : menu.image,
        restaurantId: parseInt(restaurantId),
        menuCategoryId: parseInt(dto.menuCategoryId),
        price: dto.price,
        discount: dto.discount,
        dietaryInformation: dto.dietaryInformation,
        deleted: false,
        availability,
        status
      },
    });

    this.socket.emitToClient(`get_restaurant_menu_event_${restaurantId}`)
    return new APIResponse(Status.Success, StatusMessage.Updated, null);
  }

  async deleteRestaurantMenuById(restaurantId: string, dto: DeleteDto) {
    try {
      const menu = await this.prisma.menu.updateMany({
        where: {
          id: {
            in: dto.id.map(id => parseInt(id)),
          },
          restaurantId: parseInt(restaurantId)
        },
        data: {
          deleted: true
        },
      });
      this.socket.emitToClient(`get_restaurant_menu_event_${restaurantId}`)
      return new APIResponse(Status.Success, StatusMessage.Deleted, null);
    } catch (error) {
      throw error;
    }
  }

  async getRestaurantMenuByName(restaurantId: string, name: string,) {
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

  // async ConvertToBase64String(path: string): Promise<string> {

  //   const fileData = fs.readFileSync(path);
  //   const base64String = base64js.fromByteArray(new Uint8Array(fileData));

  //   return base64String;
  // }

}