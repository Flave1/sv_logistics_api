import { Module } from "@nestjs/common";
import { CustomerMobileController } from "./customer-mobile.controller";
import { CustomerMobileService } from "./customer-mobile.service";
import { GatewayService } from "src/gateway/gateway.service";
import { MenuService } from "src/restaurant/menu/menu.service";

@Module({
    controllers: [CustomerMobileController],
    providers: [CustomerMobileService, GatewayService, MenuService]
  })
  export class CustomerMobileModule {}