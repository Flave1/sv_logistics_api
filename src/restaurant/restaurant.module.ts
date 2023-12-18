import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { redisModule } from 'src/redis/modules.config';
import { MulterModule } from '@nestjs/platform-express';
import { MenuModule } from './menu/menu.module';
import { RedisRepository } from 'src/redis/redis.repository';
@Module({
  providers: [
    RestaurantService, 
    RedisRepository
  ],
  imports:[
    redisModule,
    MulterModule.register({ dest: '../../uploads/menu-category' }),
    MulterModule.register({ dest: '../../uploads/menu-subcategory' }),
    MulterModule.register({ dest: '../../uploads/menu' }),
    MenuModule,
    redisModule
  ],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
