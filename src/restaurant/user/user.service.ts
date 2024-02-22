import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EditUserDto, SavePermissionRequest } from './dto';
import { UserType } from './enums/userType.enum';
import { GatewayService } from 'src/gateway/gateway.service';
import { DeleteDto } from 'src/dto/delete.dto';
import { getUserTypeLabel } from 'src/utils';

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

    delete user.hash;
    return user;
  }

  async updateDriverUser(userId: number, dto: EditUserDto, restaurantId: string) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;
    this.socket.emitToClient(`get_all_drivers_event_${restaurantId}`)
    return user;
  }

  async updateStaffUser(userId: number, dto: EditUserDto, restaurantId: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          address: dto.address,
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber
        },
      });
      delete user.hash;
      this.socket.emitToClient(`get_all_staff_event_${restaurantId}`)
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error)
    }
  }

  async getUserById(userId: number) {
    return await this.prisma.user.findFirst({
      where: {
        id: userId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        otherPhoneNumber: true,
        email: true,
        status: true,
        userTypeId: true,
        addresses: {
          select: {
            id: true,
            label: true,
            isDefault: true,
          },
          where: {
            isDefault: true,
          },
        },
      },
    });
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
    return user.map(({ hash, ...newUsers }) => newUsers);
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
        userTypeId: UserType.Staff,
        NOT: {
          email: 'cafayadmin@gmail.com'
        }
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    });
    return user.map(({ hash, ...newUsers }) => newUsers);
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
    return user.map(({ hash, ...newUsers }) => newUsers);
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
    return user.map(({ hash, ...newUsers }) => newUsers);
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
    return users.map(({ hash, ...newUsers }) => newUsers);
  }

  async getSuperUser() {
    const user = {
      admin: 'admin'
    }


    return user;
  }

  async deleteById(dto: DeleteDto, restaurantId: string) {
    try {

      const users = await this.prisma.user.findMany({
        where: {
          id: {
            in: dto.id.map(id => parseInt(id)),
          },
        },
      });

      if (users.length > 0) {
        const userType: UserType = users[0].userTypeId;

        const result = await this.prisma.user.deleteMany({
          where: {
            id: {
              in: users.map(user => user.id)
            }
          },
        });

        if (userType == UserType.Driver) {
          this.socket.emitToClient(`get_all_drivers_event_${restaurantId}`)
        }
        else if (userType == UserType.Staff) {
          this.socket.emitToClient(`get_all_staff_event_${restaurantId}`)
        }
        else if (userType == UserType.Customer) {
          this.socket.emitToClient(`get_all_customers_event_${restaurantId}`)
        }
      }
      return { status: "Successful", message: "User successfully deleted" }
    } catch (error) {
      throw error;
    }
  }

  async savePermissions(restaurantId: string, request: SavePermissionRequest) {
    try {

      if (request.permissions.length > 0) {
        await this.prisma.userPermission.deleteMany({
          where: { userId: request.userId, restaurantId: parseInt(restaurantId) }
        })
        const created = await this.prisma.userPermission.create({
          data: {
            userId: request.userId,
            restaurantId: parseInt(restaurantId),
            type: request.type,
            permissions: request.permissions.join(',')
          }
        });
        return created;
      }

      throw new BadRequestException("Please confirm permissions are selected")
    } catch (error) {
      throw error;
    }
  }

  async getPermissions(restaurantId: string, userId: number, type: number) {
    try {

      const pms = await this.prisma.userPermission.findFirst({
        where: {
          userId,
          restaurantId: parseInt(restaurantId),
          type,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              userTypeId: true
            }
          }
        }
      });

      if (pms)
        return {
          userId,
          restaurantId,
          type,
          permissions: pms.permissions.split(','),
          name: pms.user.firstName + " " + pms.user.lastName,
          userType: getUserTypeLabel(pms.user.userTypeId)
        }
      return null
    } catch (error) {
      throw error;
    }
  }
}