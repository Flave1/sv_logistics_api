import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerWebService } from './customerweb.service';
import { JwtGuard } from 'src/auth/guard';
import { getBaseUrl } from 'src/utils';
import { Request } from 'express';
import { CustomerMobileService } from 'src/customer-mobile/customer-mobile.service';
import { MenuService } from 'src/restaurant/menu/menu.service';
import { CheckoutFinalMenuRequest, RemoveMenuOrderDto, SaveMenuOrderDto } from 'src/customer-mobile/dto';


@ApiTags('CustomerWeb')
@Controller('customer-web')
export class CustomerWebController {
    constructor(
        private customerWebService: CustomerWebService,
        private customerMobileService: CustomerMobileService,
        private menuService: MenuService
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
        const response = await this.menuService.getRestaurantMenuCategories(restaurantId);
        for (let i = 0; i < response.length; i++) {
            response[i].image = getBaseUrl(req) + '/' + response[i].image;
        }
        return response;
    }

    @Get('restaurant-category/:restaurantId/:categoryId')
    async getRestaurantMenuByCategory(@Param('restaurantId') restaurantId: string, @Param('categoryId') categoryId: string) {
        return this.menuService.getRestaurantMenuByCategoryId(restaurantId, categoryId);
    }

    @Get('single-menu/:restaurantId/:menuId')
    async getRestaurantMenuById(@Param('restaurantId') restaurantId: string, @Param('menuId') menuId: string) {
        return this.menuService.getRestaurantMenuById(restaurantId, menuId);
    }

    @Get('search-menu/:restaurantId/:name')
    async getRestaurantMenuByName(@Param('restaurantId') restaurantId: string, @Param('name') name: string) {
        return this.menuService.getRestaurantMenuByName(restaurantId, name);
    }

    @Get('all-menu/:restaurantId')
    async getRestaurantAllMenu(@Param('restaurantId') restaurantId: string, @Req() req: Request) {
        return this.customerWebService.getRestaurantAllMenu(restaurantId, req);
    }

    @Post('save-to-cart')
  addToCart(@Body() dto: SaveMenuOrderDto) {
    return this.customerMobileService.addToCartOrUpdate(dto);
  }
  @Post('remove-from-cart')
  deleteFromCart(@Body() dto: RemoveMenuOrderDto) {
    return this.customerMobileService.removefromCart(dto);
  }

  @Get('cart-list')
  async getCartList(@Req() req: Request, @Query('customerId') customerId?: string, @Query('temporalId') temporalId?: string) {
    const response = await this.customerMobileService.getFromCart(req, parseInt(customerId), temporalId);
    return response;
  }

  @Post('get-checkout-final-menu')
  async getCheckoutFinalmenu(@Req() req: Request, @Body() menuRequest: CheckoutFinalMenuRequest) {
    const response = await this.customerMobileService.getCheckoutMenu(menuRequest.restaurantIds, menuRequest.menuIds, req);
    return response;
  }
}