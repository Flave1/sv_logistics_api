import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import * as argon from 'argon2';
import { CourierType, UserType } from "../user/enums";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthService } from "src/auth/auth.service";
import { client_permossions } from "../enums";


@Injectable()
export class ClientService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService
  ) { }

  async CreateClient(dto: CreateClientDto) {
    // generate the password hash
    const defaultPassword = "Password123"
    const hash = await argon.hash(defaultPassword);
    // save the new user in the db
    try {
      await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            hash,
            phoneNumber: dto.phoneNumber,
            address: dto.address,
            restaurantId: null,
            userTypeId: UserType.Client,
            courierTypeId: CourierType.Default,
            deleted: false
          },
        });
        await tx.userPermission.create({
          data: {
            userId: user.id,
            type: 1,
            permissions: client_permossions,
            restaurantId: null,
          }
        });

        return this.authService.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
      })
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
    } finally {
      await this.prisma.$disconnect();
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
}