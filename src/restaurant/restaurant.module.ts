import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { redisModule } from 'src/redis/modules.config';
import { MulterModule } from '@nestjs/platform-express';
import { MenuModule } from './menu/menu.module';
import { RedisRepository } from 'src/redis/redis.repository';
import { GatewayService } from 'src/gateway/gateway.service';
import { GatewayModule } from 'src/gateway/gateway.module';
import { MenuService } from './menu/menu.service';
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
    MenuModule
  ],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
