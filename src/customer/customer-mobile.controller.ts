import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { getBaseUrl } from 'src/utils';
import { Request } from 'express';
import { CheckoutDto, CheckoutFinalMenuRequest, RemoveMenuOrderDto, SaveMenuOrderDto } from './dto';
import { MenuService } from 'src/restaurant/menu/menu.service';

@ApiTags('CustomerMobile')
@Controller('customer-mobile')
export class CustomerMobileController {
  constructor(
    private customerService: CustomerService,
    private menuService: MenuService
  ) { }

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
  async getRestaurantById(@Param('id') restaurantId: string, @Req() req: Request) {
    const response = await this.customerService.getRestaurantById(restaurantId);
    response.image = getBaseUrl(req) + '/' + response.image

    return response;
  }

  @Get('restaurants')
  async getRestaurant(@Req() req: Request) {
    const response = await this.customerService.getRestaurants();
    for (let i = 0; i < response.length; i++) {
      response[i].image = getBaseUrl(req) + '/' + response[i].image
    }
    return response;
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
    return await this.customerService.getPopularMenuV1(req);
  }

  @Post('save-to-cart')
  addToCart(@Body() dto: SaveMenuOrderDto) {
    return this.customerService.addToCartOrUpdate(dto);
  }
  @Post('remove-from-cart')
  deleteFromCart(@Body() dto: RemoveMenuOrderDto) {
    return this.customerService.removefromCart(dto);
  }

  @Get('cart-list')
  async getCartList(@Req() req: Request, @Query('customerId') customerId?: string, @Query('temporalId') temporalId?: string) {
    const response = await this.customerService.getFromCart(req, parseInt(customerId), temporalId);
    return response;
  }

  @Post('get-checkout-final-menu')
  async getCheckoutFinalmenu(@Req() req: Request, @Body() menuRequest: CheckoutFinalMenuRequest) {
    const response = await this.customerService.getCheckoutMenu(menuRequest.restaurantIds, menuRequest.menuIds, req);
    return response;
  }

  @Post('checkout')
  async checkoutOrder(@Body() request: CheckoutDto) {
      const response = await this.customerService.checkoutOrder(request);
      return response;
  }
}

