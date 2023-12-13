import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EditUserDto } from './dto';
import * as argon from 'argon2';
import { Restaurant } from 'src/restaurant/enums/restaurant.enum';
import { UserType } from './enums/userType.enum';
import { CourierType } from 'src/restaurant/user/enums/courierType.enum';
import { GatewayService } from 'src/gateway/gateway.service';
import { DeleteUserDto } from './dto/delete.user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private socket: GatewayService) { }

  async updateUser(
    userId: string,
    dto: EditUserDto,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        ...dto,
      },
    });

    delete user.hash; //Todo: change to transformer

    return user;
  }

  async getUserById(
    userId: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: parseInt(userId)
      },
    });
    delete user.hash; //Todo: change to transformer

    return user;
  }

  async getUserByRestaurantId(restaurantId: string) {
    const user = await this.prisma.user.findMany({
      where: {
        restaurantId: parseInt(restaurantId)
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    });
    return user.map(({ hash, ...newUsers }) => newUsers); //Todo: change mapping to transformer
  }

  async getRestaurantStaff(restaurantId: string) {
    const user = await this.prisma.user.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        userTypeId: UserType.Staff
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    });
    return user.map(({ hash, ...newUsers }) => newUsers); //Todo: change mapping to transformer
  }

  async getRestaurantDrivers(restaurantId: string) {
    const user = await this.prisma.user.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        userTypeId: UserType.Driver
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    });
    return user.map(({ hash, ...newUsers }) => newUsers); //Todo: change mapping to transformer
  }
  async getRestaurantCustomers(restaurantId: string) {
    const user = await this.prisma.user.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        userTypeId: UserType.Customer
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    });
    return user.map(({ hash, ...newUsers }) => newUsers); //Todo: change mapping to transformer
  }

  async getAllUsers(
  ) {
    const users = (await this.prisma.user.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    }));
    return users.map(({ hash, ...newUsers }) => newUsers); //Todo: change mapping to transformer
  }

  async getSuperUser() {
    const user = {
      admin: 'admin'
    }


    return user;
  }

  async deleteById(dto: DeleteUserDto) {
    try {
      const result = await this.prisma.user.delete({
        where: {
          id: parseInt(dto.userId),
        },
      });
      
      if (!result) {
        throw new NotFoundException(`Record with ID ${dto.userId} not found`);
      }

      return {status: "Successful", message: "User successfully deleted"} ///ToDo: Create implement generic API Response
    } catch (error) {
      throw error;
    }
  }
}