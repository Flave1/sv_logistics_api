import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { GatewayService } from "src/gateway/gateway.service";

@Module({
    controllers: [CustomerController],
    providers: [CustomerService, GatewayService]
  })
  export class CustomerModule {}