import { Injectable } from "@nestjs/common";
import { GatewayService } from "src/gateway/gateway.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMenuCategoryDto } from "./dto/create.menu-category.dto";
import { APIResponse } from "../../dto/api-response";
import { Status } from "../enums/status-code.enum";
import { DeleteDto } from "src/dto/delete.dto";
import { StatusMessage } from "../enums/status-message.enum";
import { UpdateMenuCategoryDto } from "./dto/update.menu-category.dto";
import { CreateMenuSubCategoryDto } from "./dto/create-menu-subcategory.dto";
import { UpdateMenuSubCategoryDto } from "./dto/update.menu-subcategory.dto";
import { CreateMenuDto } from "./dto/create.menu.dto";
import { UpdateMenuDto } from "./dto/update.menu.dto";
import * as fs from 'fs';

import * as base64js from 'base64-js';
import { MenuManagementEvents } from "src/gateway/dto";


@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService, private socket: GatewayService) { }

  async CreateRestaurantMenuCategory(restaurantId: string, file: Express.Multer.File, dto: CreateMenuCategoryDto) {
    try {
        //Check for existing categories
        const name = dto.name.toLowerCase().replace(/\s/g, '')
        const categories = await this.prisma.menuCategory.findMany({
            where: {
                restaurantId: parseInt(restaurantId),
                deleted: false
            },
          });

          for(let  i = 0; i < categories.length; i++ )
          {
                if(categories[i].name.toLowerCase().replace(/\s/g, '') === name)
                { 
                    return new APIResponse(Status.Success, StatusMessage.Exist, null);
                }
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
        this.socket.emitToClient(MenuManagementEvents.get_restaurant_menu_categories_event)
        return new APIResponse(Status.Success, StatusMessage.Created, null);
      
    } catch (error) {
      throw error;
    }
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
      for(let i = 0; i<categories.length ; i++)
      {
        try {
          const base64Image = await this.ConvertToBase64String(categories[i].image)
        categories[i].image = base64Image
        } catch (error) {
          categories[i].image = 'https://media.istockphoto.com/id/1468860049/photo/fitness-woman-eating-a-healthy-poke-bowl-in-the-kitchen-at-home.jpg?s=1024x1024&w=is&k=20&c=wvo0akyUsvpQfa0x9C86btd8D2aRfsWiGLWdURWUT78='
        }
        
      }
      return new APIResponse(Status.Success, StatusMessage.GetSuccess, categories);
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
        if(!category)
        {
            return new APIResponse(Status.OtherErrors, StatusMessage.NoRecord, null);
        }
        return new APIResponse(Status.Success, StatusMessage.GetSuccess, category);
    } catch (error) {
        throw error
    }
}

async deleteRestaurantMenuCategoryById(restaurantId: string, dto: DeleteDto) {
    try {
        const categories = await this.prisma.menuCategory.updateMany({
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
          
        this.socket.emitToClient(MenuManagementEvents.get_restaurant_menu_categories_event)
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
    if(!category)
    {
        return new APIResponse(Status.OtherErrors, StatusMessage.NoRecord, null);
    }

    if(category.name.toLowerCase().replace(/\s/g, '') == dto.name.toLowerCase().replace(/\s/g, '') && category.id != parseInt(dto.id))
    {
        return new APIResponse(Status.OtherErrors, StatusMessage.Exist, null);
    }

    const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
    const user = await this.prisma.menuCategory.update({
      where: {
        restaurantId: parseInt(restaurantId),
        id: parseInt(dto.id),
      },
      data: {
        name: dto.name,
        description: dto.description,
        image: file.path,
        restaurantId: parseInt(restaurantId),
        deleted: false,
        status
      },
    });
    this.socket.emitToClient(MenuManagementEvents.get_restaurant_menu_categories_event)
    return new APIResponse(Status.Success, StatusMessage.Updated, null);
  }

  async CreateRestaurantMenu(restaurantId: string, file: Express.Multer.File, dto: CreateMenuDto) {
    try {

        //Check for existing menu
        const name = dto.name.toLowerCase().replace(/\s/g, '')
        const menus = await this.prisma.menu.findMany({
            where: {
                restaurantId: parseInt(restaurantId),
                deleted: false
            },
          });

          for(let  i = 0; i < menus.length; i++ )
          {
                if(menus[i].name.toLowerCase().replace(/\s/g, '') === name)
                { 
                    return new APIResponse(Status.Success, StatusMessage.Exist, null);
                }
          }

        //Add new menu
        const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
        const availability = dto.availability.toString().toLowerCase() == 'true' ? true : false;
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
                availability,
                status
            },
        });
      
        this.socket.emitToClient(MenuManagementEvents.get_restaurant_menu_event)
        this.socket.emitToClient(MenuManagementEvents.get_restaurant_menu_by_category_event)
        return new APIResponse(Status.Success, StatusMessage.Created, null);
      
    } catch (error) {
      throw error;
    }
  }

  async getRestaurantMenu(restaurantId: string) {
    const menus = (await this.prisma.menu.findMany({
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
    return new APIResponse(Status.Success, StatusMessage.GetSuccess, menus);
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
        if(!menu)
        {
            return new APIResponse(Status.OtherErrors, StatusMessage.NoRecord, null);
        }
    
        const base64Image = await this.ConvertToBase64String(menu.image)
        menu.image = base64Image
    
        return new APIResponse(Status.Success, StatusMessage.GetSuccess, menu);
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
      for(let i = 0; i<menuList.length ; i++)
      {
        const base64Image = await this.ConvertToBase64String(menuList[i].image)
        menuList[i].image = base64Image
      }
  
      return new APIResponse(Status.Success, StatusMessage.GetSuccess, menuList);
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
    if(!menu)
    {
        return new APIResponse(Status.OtherErrors, StatusMessage.NoRecord, null);
    }

    if(menu.name.toLowerCase().replace(/\s/g, '') == dto.name.toLowerCase().replace(/\s/g, ''))
    {
        return new APIResponse(Status.OtherErrors, StatusMessage.Exist, null);
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
        image: file.path,
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

    this.socket.emitToClient(MenuManagementEvents.get_restaurant_menu_categories_event)
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
        return new APIResponse(Status.Success, StatusMessage.Deleted, null);
    } catch (error) {
      throw error;
    }
  }

  async ConvertToBase64String(path: string ): Promise<string> {
    
    const fileData = fs.readFileSync(path);
    const base64String = base64js.fromByteArray(new Uint8Array(fileData));

    return base64String;
  }

}