import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './restaurant/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { GatewayModule } from './gateway/gateway.module';
import { CustomerMobileModule } from './customer-mobile/customer-mobile.module';
import { CustomerWebModule } from './customerweb/customerweb.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    RestaurantModule,
    GatewayModule,
    CustomerWebModule,
    CustomerMobileModule,
  ],
})
export class AppModule { }