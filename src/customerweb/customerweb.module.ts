import { Module } from "@nestjs/common";
import { CustomerWebController } from "./customerweb.controller";
import { CustomerWebService } from "./customerweb.service";
import { GatewayService } from "src/gateway/gateway.service";
import { CustomerMobileService } from "src/customer-mobile/customer-mobile.service";

@Module({
    controllers: [CustomerWebController],
    providers: [CustomerWebService, GatewayService, CustomerMobileService]
  })
  export class CustomerWebModule {}