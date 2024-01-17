import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerWebService } from './customerweb.service';
import { JwtGuard } from 'src/auth/guard';
import { getBaseUrl } from 'src/utils';
import { Request } from 'express';
import { CustomerMobileService } from 'src/customer-mobile/customer-mobile.service';


@ApiTags('CustomerWeb')
@Controller('customer-web')
export class CustomerWebController {
    constructor(
        private customerWebService: CustomerWebService,
        private customerMobileService: CustomerMobileService,
    ) { }

    @Get('restaurants')
    async getRestaurant(@Req() req: Request) {
      const response = await this.customerMobileService.getRestaurants();
      for (let i = 0; i < response.length; i++) {
        response[i].image = getBaseUrl(req) + '/' + response[i].image
      }
      return response;
    }

    @Get('restaurant-categories/:restaurantId')
    async getRestaurantCategories(@Param('restaurantId') restaurantId: string, @Req() req: Request) {
        const response = await this.customerWebService.getRestaurantMenuCategories(restaurantId);
        for (let i = 0; i < response.length; i++) {
            response[i].image = getBaseUrl(req) + '/' + response[i].image;
        }
        return response;
    }

    @Get('restaurant-category/:restaurantId/:categoryId')
    async getRestaurantMenuByCategory(@Param('restaurantId') restaurantId: string, @Param('categoryId') categoryId: string) {
        return this.customerWebService.getRestaurantMenuByCategoryId(restaurantId, categoryId);
    }

    @Get('single-menu/:restaurantId/:menuId')
    async getRestaurantMenuById(@Param('restaurantId') restaurantId: string, @Param('menuId') menuId: string) {
        return this.customerWebService.getRestaurantMenuById(restaurantId, menuId);
    }

    @Get('search-menu/:restaurantId/:name')
    async getRestaurantMenuByName(@Param('restaurantId') restaurantId: string, @Param('name') name: string) {
        return this.customerWebService.getRestaurantMenuByName(restaurantId, name);
    }

    @Get('all-menu/:restaurantId')
    async getRestaurantAllMenu(@Param('restaurantId') restaurantId: string, @Req() req: Request) {
        return this.customerWebService.getRestaurantAllMenu(restaurantId, req);
    }
}