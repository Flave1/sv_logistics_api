import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RedisRepository } from 'src/redis/redis.repository';
import { redisModule } from 'src/redis/modules.config';
import { MulterModule } from '@nestjs/platform-express';
import { MenuModule } from './menu/menu.module';
@Module({
  providers: [
    RestaurantService, 
    // RedisRepository
  ],
  // imports:[redisModule],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
