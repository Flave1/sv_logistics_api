import { Module } from "@nestjs/common";
import { CustomerWebController } from "./customerweb.controller";
import { CustomerWebService } from "./customerweb.service";
import { GatewayService } from "src/gateway/gateway.service";

@Module({
    controllers: [CustomerWebController],
    providers: [CustomerWebService, GatewayService]
  })
  export class CustomerWebModule {}