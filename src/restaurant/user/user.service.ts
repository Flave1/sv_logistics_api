import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EditUserDto } from './dto';
import { UserType } from './enums/userType.enum';
import { GatewayService } from 'src/gateway/gateway.service';
import { DeleteDto } from 'src/dto/delete.dto';
import { UserManagementEvents } from 'src/gateway/dto/gateway.constants';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private socket: GatewayService) { }

  async updateUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash; //Todo: change to transformer
    return user;
  }

  async updateDriverUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash; //Todo: change to transformer
    this.socket.emitToClient(UserManagementEvents.get_all_drivers_event)
    return user;
  }

  async updateStaffUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash; //Todo: change to transformer
    this.socket.emitToClient(UserManagementEvents.get_all_staff_event)
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

  async getUserByStaffId(staffId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: parseInt(staffId)
      }
    });
    delete user.hash
    return user
  }
  async getUserByDriverId(driverId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: parseInt(driverId)
      }
    });
    delete user.hash
    return user
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

  async deleteById(dto: DeleteDto) {
    try {

      const users = await this.prisma.user.findMany({
        where: {
          id: {
            in: dto.id.map(id => parseInt(id)),
          },
        },
      });

      if(users.length > 0) {
        const userType: UserType = users[0].userTypeId;

        const result = await this.prisma.user.deleteMany({
          where: {
            id: {
              in: users.map(user => user.id)
            }
          },
        });

        if(userType == UserType.Driver )
        {
          this.socket.emitToClient(UserManagementEvents.get_all_drivers_event)
        }
        else if(userType == UserType.Staff )
        {
          this.socket.emitToClient(UserManagementEvents.get_all_staff_event)
        }
        else if(userType == UserType.Customer )
        {
          this.socket.emitToClient(UserManagementEvents.get_all_customers_event)
        }
      }
      return { status: "Successful", message: "User successfully deleted" }
    } catch (error) {
      throw error;
    }
  }
}