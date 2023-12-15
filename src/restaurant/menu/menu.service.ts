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
}

async deleteCategoryById(restaurantId: string, dto: DeleteDto) {
    try {
        const categories = await this.prisma.menuCategory.updateMany({
            where: {
              id: {
                in: dto.id.map(id => parseInt(id)),
              }
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

}