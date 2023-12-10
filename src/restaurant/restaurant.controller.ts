import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import { JwtGuard } from '../auth/guard';
import { RestaurantService } from './restaurant.service';
import {
    CreateRestaurantDto,
    EditRestaurantDto,
} from './dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Restaurant')
// @UseGuards(JwtGuard)
@Controller('restaurant')
export class RestaurantController {
    constructor(
        private restaurantService: RestaurantService,
    ) { }

    @Get()
    // @UseInterceptors(CacheInterceptor) 
    // @CacheTTL(1000)
    getRestaurant() {
        return this.restaurantService.getRestaurants();
    }

    @Get(':id')
    getRestaurantById(@Param('id', ParseIntPipe) restaurantId: number) {
        return this.restaurantService.getRestaurantById(restaurantId);
    }

    @Post()
    createRestaurant(@Body() dto: CreateRestaurantDto) {
        return this.restaurantService.createRestaurant(dto);
    }

    @Patch(':id')
    editRestaurantById(
        @Param('id', ParseIntPipe) restaurantId: number,
        @Body() dto: EditRestaurantDto,
    ) {
        return this.restaurantService.editRestaurantById(restaurantId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteRestaurantById(
        @Param('id', ParseIntPipe) restaurantId: number,
    ) {
        return this.restaurantService.deleteRestaurantById(restaurantId);
    }
}