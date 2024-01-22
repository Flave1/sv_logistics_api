import { Module } from "@nestjs/common";
import { CustomerMobileController } from "./customer-mobile.controller";
import { CustomerService } from "./customer-mobile.service";
import { GatewayService } from "src/gateway/gateway.service";
import { MenuService } from "src/restaurant/menu/menu.service";

@Module({
    controllers: [CustomerMobileController],
    providers: [CustomerService, GatewayService, MenuService]
  })
  export class CustomerModule {}