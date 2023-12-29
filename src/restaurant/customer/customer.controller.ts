import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MenuService } from '../menu/menu.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { getBaseUrl } from 'src/utils';
import { Request } from 'express';
import { CreateMenuOrderDto } from './dto/create-menu-order.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('restaurant-menu/:id')
  async getMenuById(@Param('id') id: string, @Req() req: Request) {
    const response = await this.customerService.getRestaurantMenuById(id);
    try {
      response.image = getBaseUrl(req) + '/' + response.image;
    } catch (error) {
      response.image = '';
    }
    return response;
  }

  @Get('restaurant-categories/:restaurantId')
  async getRestaurantCategories(@Param('restaurantId') restaurantId: string, @Req() req: Request) {
    const response = await this.customerService.getRestaurantMenuCategories(restaurantId);
    for (let i = 0; i < response.length; i++) {
      try {
        response[i].image = getBaseUrl(req) + '/' + response[i].image;
      } catch (error) {
        response[i].image = '';
      }
    }
    return response;
  }

  @Get('restaurant-menu/category/:categoryId')
  async getMenuByCategoryId(@Param('categoryId') categoryId: string, @Req() req: Request) {
    const response = await this.customerService.getRestaurantMenuByCategoryId(categoryId);
    for (let i = 0; i < response.length; i++) {
      response[i].image = getBaseUrl(req) + '/' + response[i].image;
    }
    return response;
  }

  @Get('restaurant/:id')
    getRestaurantById(@Param('id') restaurantId: string) {
        return this.customerService.getRestaurantById(restaurantId);
    }

    @Get('restaurants')
    getRestaurant() {
        return this.customerService.getRestaurants();
    }

@Get('all-restaurant-menu/:restaurantId')
async getAllMenu(@Param('restaurantId') restaurantId: string, @Req() req: Request) {
    const response = await this.customerService.getRestaurantMenu(restaurantId);
    for (let i = 0; i < response.length; i++) {
        response[i].image = getBaseUrl(req) + '/' + response[i].image
    }
    return response;
}

@Get('popular-restaurant-menu')
async getMenu(@Req() req: Request) {
    const response = await this.customerService.getPopularMenu();
    response.image = getBaseUrl(req) + '/' + response.image
    return response;
}

@Post('create-order')
    createCategory(@Body() dto: CreateMenuOrderDto) {
        return this.customerService.CreateMenuOrder(dto);
    }
}
