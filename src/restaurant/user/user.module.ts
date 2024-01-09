import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GatewayService } from 'src/gateway/gateway.service';
import { AddressModule } from './address/address.module';

@Module({
  controllers: [UserController],
  providers: [UserService, GatewayService],
  imports: [AddressModule]
})
export class UserModule {}
