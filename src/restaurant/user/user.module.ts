import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GatewayService } from 'src/gateway/gateway.service';

@Module({
  controllers: [UserController],
  providers: [UserService, GatewayService]
})
export class UserModule {}
