import { Injectable, ForbiddenException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "src/prisma/prisma.service";
import { GatewayService } from "src/gateway/gateway.service";
import { CreateClientDto } from "./dto/create-client.dto";
import * as argon from 'argon2';
import { Restaurant } from "../enums";
import { CourierType, UserType } from "../user/enums";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class ClientService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private socket: GatewayService
  ) { }

async CreateClient(dto: CreateClientDto) {
    // generate the password hash
    const defaultPassword = "Password123"
    const hash = await argon.hash(defaultPassword);
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash,
          phoneNumber: dto.phoneNumber,
          address: dto.address,
          restaurantId: Restaurant.Default,
          userTypeId: UserType.Client,
          courierTypeId: CourierType.Default,
          deleted: false
        },
      });

      return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async getClients() {
    const user = await this.prisma.user.findMany({
      where: {
        userTypeId: UserType.Client,
        deleted: false
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    });
    return user.map(({ hash, ...newUsers }) => newUsers); //Todo: change mapping to transformer
  }

  async signToken(userId: number, email: string, userType: number, restaurantId: number): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      userType,
      restaurantId
    };
    const secret = 'wowthisisabadsecret123'; //this.config.get('JWT_SECRET');

    try {
      const token = await this.jwt.signAsync(payload,
        {
          expiresIn: '60m',
          secret: secret,
          jwtid: ''
        },
      );
      return {
        access_token: token,
      };
    } catch (error) {
      console.log('error', error);

    }

    return null
  }
}