import { Module } from "@nestjs/common";
import { CustomerwebController } from "./customerweb.controller";
import { CustomerWebService } from "./customerweb.service";
import { GatewayService } from "src/gateway/gateway.service";

@Module({
    controllers: [CustomerwebController],
    providers: [CustomerWebService, GatewayService]
  })
  export class CustomerWebModule {}