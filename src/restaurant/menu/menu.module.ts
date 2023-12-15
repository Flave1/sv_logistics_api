import { GatewayService } from "src/gateway/gateway.service";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { Module } from "@nestjs/common";


@Module({
    controllers: [MenuController],
    providers: [MenuService, GatewayService]
  })
  export class MenuModule {}