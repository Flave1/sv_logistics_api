import { Module } from "@nestjs/common";
import { GatewayService } from "src/gateway/gateway.service";
import { CountryService } from "./country.service";
import { CountryController } from "./country.controller";

@Module({
    controllers: [CountryController],
    providers: [CountryService, GatewayService]
  })
  export class CountryModule {}