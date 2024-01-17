import { Module } from "@nestjs/common";
import { CustomerMobileController } from "./customer-mobile.controller";
import { CustomerMobileService } from "./customer-mobile.service";
import { GatewayService } from "src/gateway/gateway.service";

@Module({
    controllers: [CustomerMobileController],
    providers: [CustomerMobileService, GatewayService]
  })
  export class CustomerMobileModule {}