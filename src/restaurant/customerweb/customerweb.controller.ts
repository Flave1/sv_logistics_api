import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerWebService } from './customerweb.service';
import { JwtGuard } from 'src/auth/guard';


@ApiTags('CustomerWeb')
@Controller('customerweb')
export class CustomerWebController {
    constructor(
        private customerWebService: CustomerWebService,
    ) { }

    @Get('restaurant-categories/:restaurantId')
    async getRestaurantCategories(@Param('restaurantId') restaurantId: string) {
        return this.customerWebService.getRestaurantMenuCategories(restaurantId);
    }

    @Get('restaurant-category/:restaurantId/:categoryId')
    async getRestaurantMenuByCategory(@Param('restaurantId') restaurantId: string, @Param('categoryId') categoryId: string) {
        return this.customerWebService.getRestaurantMenuByCategoryId(restaurantId, categoryId);
    }

    @Get('restaurant-menu/:restaurantId/:menuId')
    async getRestaurantMenuById(@Param('restaurantId') restaurantId: string, @Param('menuId') menuId: string) {
        return this.customerWebService.getRestaurantMenuById(restaurantId, menuId);
    }

    @Get('search-menu/:restaurantId/:name')
    async getRestaurantMenuByName(@Param('restaurantId') restaurantId: string, @Param('name') name: string) {
        return this.customerWebService.getRestaurantMenuByName(restaurantId, name);
    }

    @Get('restaurant-allmenu/:restaurantId')
    async getRestaurantAllMenu(@Param('restaurantId') restaurantId: string) {
        return this.customerWebService.getRestaurantAllMenu(restaurantId);
    }
}