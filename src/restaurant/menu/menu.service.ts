import { Injectable } from "@nestjs/common";
import { GatewayService } from "src/gateway/gateway.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMenuCategoryDto } from "./dto/create.menu-category.dto";
import { stringify } from "querystring";
import { APIResponse } from "../constant/api-response";
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


@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService, private socket: GatewayService) { }

  async CreateCategory(restaurantId: string, file: Express.Multer.File, dto: CreateMenuCategoryDto) {
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
      
        return new APIResponse(Status.Success, StatusMessage.Created, null);
      
    } catch (error) {
      throw error;
    }
  }

  async getAllCategories(restaurantId: string) {
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
      return new APIResponse(Status.Success, StatusMessage.GetSuccess, categories);
    }

async getCategoryById(restaurantId: string, categoryId: string) {
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
        const base64Image = await this.ConvertToBase64String(category.image)
        category.image = base64Image
        return new APIResponse(Status.Success, StatusMessage.GetSuccess, category);
    } catch (error) {
        throw error
    }
}

async deleteCategoryById(restaurantId: string, dto: DeleteDto) {
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
        return new APIResponse(Status.Success, StatusMessage.Deleted, null);
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(restaurantId: string, file: Express.Multer.File, dto: UpdateMenuCategoryDto) {
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

    if(category.name.toLowerCase().replace(/\s/g, '') == dto.name.toLowerCase().replace(/\s/g, ''))
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
    return user;
  }

  async CreateSubCategory(restaurantId: string, file: Express.Multer.File, dto: CreateMenuSubCategoryDto) {
    try {

        //Check for existing subcategories
        const name = dto.name.toLowerCase().replace(/\s/g, '')
        const subCategories = await this.prisma.menuSubCategory.findMany({
            where: {
                restaurantId: parseInt(restaurantId),
                deleted: false
            },
          });

          for(let  i = 0; i < subCategories.length; i++ )
          {
                if(subCategories[i].name.toLowerCase().replace(/\s/g, '') === name)
                { 
                    return new APIResponse(Status.Success, StatusMessage.Exist, null);
                }
          }

        //Add new subcategory
        const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
        const menuSubCategory = await this.prisma.menuSubCategory.create({
            data: {
                name: dto.name,
                description: dto.description,
                image: file.path,
                restaurantId: parseInt(restaurantId),
                menuCategoryId: parseInt(dto.menuCategory),
                deleted: false,
                status
            },
        });
      
        return new APIResponse(Status.Success, StatusMessage.Created, null);
      
    } catch (error) {
      throw error;
    }
  }

  async getAllSubCategories(restaurantId: string) {
    const subCategories = (await this.prisma.menuSubCategory.findMany({
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
    return new APIResponse(Status.Success, StatusMessage.GetSuccess, subCategories);
  }

  async getSubCategoryById(restaurantId: string, subCategoryId: string) {
    try {
        const subCategory = await this.prisma.menuSubCategory.findFirst({
            where: {
            id: parseInt(subCategoryId),
            restaurantId: parseInt(restaurantId),
            deleted: false
            },
            include: {
              menuCategory: true,
            }
        });
        if(!subCategory)
        {
            return new APIResponse(Status.OtherErrors, StatusMessage.NoRecord, null);
        }
        const base64Image = await this.ConvertToBase64String(subCategory.image)
        subCategory.image = base64Image
        return new APIResponse(Status.Success, StatusMessage.GetSuccess, subCategory);
    } catch (error) {
        throw error
    }
}

async deleteSubCategoryById(restaurantId: string, dto: DeleteDto) {
    try {
        const subCategories = await this.prisma.menuSubCategory.updateMany({
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

  async updateSubCategory(restaurantId: string, file: Express.Multer.File, dto: UpdateMenuSubCategoryDto) {
    const subCategory = await this.prisma.menuSubCategory.findFirst({
        where: {
        id: parseInt(dto.id),
        restaurantId: parseInt(restaurantId),
        deleted: false
        }
    });
    if(!subCategory)
    {
        return new APIResponse(Status.OtherErrors, StatusMessage.NoRecord, null);
    }

    if(subCategory.name.toLowerCase().replace(/\s/g, '') == dto.name.toLowerCase().replace(/\s/g, ''))
    {
        return new APIResponse(Status.OtherErrors, StatusMessage.Exist, null);
    }

    const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
    await this.prisma.menuSubCategory.update({
      where: {
        restaurantId: parseInt(restaurantId),
        id: parseInt(dto.id),
      },
      data: {
        name: dto.name,
        description: dto.description,
        image: file.path,
        restaurantId: parseInt(restaurantId),
        menuCategoryId: parseInt(dto.menuCategory),
        deleted: false,
        status
      },
    });
    return new APIResponse(Status.Success, StatusMessage.Updated, null);
  }

  async CreateMenu(restaurantId: string, file: Express.Multer.File, dto: CreateMenuDto) {
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
                menuSubCategoryId: parseInt(dto.menuSubCategoryId),
                price: dto.price,
                discount: dto.discount,
                dietaryInformation: dto.dietaryInformation,
                deleted: false,
                availability,
                status
            },
        });
      
        return new APIResponse(Status.Success, StatusMessage.Created, null);
      
    } catch (error) {
      throw error;
    }
  }

  async getAllMenu(restaurantId: string) {
    const menus = (await this.prisma.menu.findMany({
      where: {
          restaurantId: parseInt(restaurantId),
          deleted: false
      },
      include: {
        menuSubCategory: {
          include: {
              menuCategory: true
          }
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    }));
    return new APIResponse(Status.Success, StatusMessage.GetSuccess, menus);
  }

  async getMenuById(restaurantId: string, subCategoryId: string) {
    try {
        const menu = await this.prisma.menu.findFirst({
            where: {
            id: parseInt(subCategoryId),
            restaurantId: parseInt(restaurantId),
            deleted: false
            },
            include: {
              menuSubCategory: {
                include: {
                    menuCategory: true
                }
              },
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

async updateMenu(restaurantId: string, file: Express.Multer.File, dto: UpdateMenuDto) {
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
        menuSubCategoryId: parseInt(dto.menuSubCategoryId),
        price: dto.price,
        discount: dto.discount,
        dietaryInformation: dto.dietaryInformation,
        deleted: false,
        availability,
        status
      },
    });
    return new APIResponse(Status.Success, StatusMessage.Updated, null);
  }

  async deleteMenuById(restaurantId: string, dto: DeleteDto) {
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