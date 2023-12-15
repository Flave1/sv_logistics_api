import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './restaurant/user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { GatewayModule } from './gateway/gateway.module';
import { MenuModule } from './restaurant/menu/menu.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true
    }),
    MulterModule.register({
      dest: './uploads/menu-category',
    }),
    MulterModule.register({
      dest: './uploads/menu-subcategory',
    }),
    MulterModule.register({
      dest: './uploads/menu',
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    RestaurantModule,
    GatewayModule,
    MenuModule
  ],
})
export class AppModule {}