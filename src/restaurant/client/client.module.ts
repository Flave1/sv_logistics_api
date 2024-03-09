import { Module } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { GatewayService } from "src/gateway/gateway.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";

@Module({
  controllers: [ClientController],
  providers: [ClientService, GatewayService, PrismaService, JwtService, AuthService]
})
export class ClientModule { }