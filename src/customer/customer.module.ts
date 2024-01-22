import { Module } from "@nestjs/common";
import { CustomerMobileController } from "./customer-mobile.controller";
import { CustomerService } from "./customer.service";
import { GatewayService } from "src/gateway/gateway.service";
import { MenuService } from "src/restaurant/menu/menu.service";
import { UserService } from "src/restaurant/user/user.service";

@Module({
    controllers: [CustomerMobileController],
    providers: [CustomerService, GatewayService, MenuService, UserService]
  })
  export class CustomerModule {}