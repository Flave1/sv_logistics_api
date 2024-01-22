import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MenuModule } from './menu/menu.module';
import { GatewayService } from 'src/gateway/gateway.service';
import { MenuService } from './menu/menu.service';
import { CountryModule } from './country/country.module';
import { ClientModule } from './client/client.module';
@Module({
  providers: [
    RestaurantService, 
    // RedisRepository,
    GatewayService,
    MenuService
  ],
  imports:[
    // redisModule,
    MulterModule.register({ dest: '../uploads/menu-category' }),
    MulterModule.register({ dest: '../uploads/menu-subcategory' }),
    MulterModule.register({ dest: '../uploads/menu' }),
    MenuModule,
    CountryModule,
    ClientModule
  ],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
