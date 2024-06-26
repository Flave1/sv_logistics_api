import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Restaurant } from 'src/restaurant/enums/restaurant.enum';
import { UserType } from 'src/restaurant/user/enums/userType.enum';
import { CourierType } from 'src/restaurant/user/enums/courierType.enum';
import { CreateCustomerDto } from 'src/auth/dto/create.customer.dto';
import { GatewayService } from 'src/gateway/gateway.service';
import { UserManagementEvents } from 'src/gateway/dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import * as crypto from 'crypto';
import { CreateDriverDto } from './dto/create.driver.dto';
import { CreateStaffDto } from './dto/create.staff.dto';
import * as jwt from 'jsonwebtoken'
import { User } from '@prisma/client';
import { staff_permossions } from 'src/restaurant/enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private socket: GatewayService
  ) { }

  async CreateCustomer(dto: CreateCustomerDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
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
          userTypeId: UserType.Customer,
          courierTypeId: CourierType.Default
        },
      });

      this.socket.emitToClient(`get_all_customers_event_${user.restaurantId}`)
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


  //** Method to profile Staff and Drivers */
  async CreateStaff(restaurantId: string, dto: CreateStaffDto, tranx: any = null, permissions: string = staff_permossions) {

    
    const defaultPassword = "Password123"
    const hash = await argon.hash(defaultPassword);
    const data = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      hash,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      restaurantId: restaurantId ? parseInt(restaurantId) : null,
      userTypeId: UserType.Staff,
      courierTypeId: CourierType.Default
    };
    let user: User = null
    try {
      if (tranx) {
        user = await tranx.user.create({ data });
        await tranx.userPermission.create({
          data: {
            userId: user.id,
            type: 1,
            permissions,
            restaurantId: restaurantId ? parseInt(restaurantId) : null,
          }
        });
      } else {
        user = await this.prisma.user.create({ data });
        await this.prisma.userPermission.create({
          data: {
            userId: user.id,
            type: 1,
            permissions,
            restaurantId: restaurantId ? parseInt(restaurantId) : null,
          }
        });
      }

      this.socket.emitToClient(`get_all_staff_event_${restaurantId}`)
      return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
    } catch (error) {
      console.log('error', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exist');
        }
      }
      throw error;
    }
  }

  //** Method to profile Drivers */
  async CreateDriver(restaurantId: string, dto: CreateDriverDto) {
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
          restaurantId: parseInt(restaurantId),
          userTypeId: UserType.Driver,
          courierTypeId: parseInt(dto.courierType)
        },
      });

      this.socket.emitToClient(`get_all_drivers_event_${restaurantId}`)
      return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exist');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    // if user does not exist throw exception
    if (!user)
      throw new ForbiddenException('Invalid Credentials');

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException('Invalid Credentials');

    const userMermissions = await this.prisma.userPermission.findFirst({ where: { userId: user.id, restaurantId: user.restaurantId }, select: { permissions: true } });


    return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId, userMermissions.permissions);
  }

  async refreshToken(token: string) {
    try {
      const decodedToken: any = jwt.decode(token, { complete: true });

      if (this.isTokenExpired(decodedToken)) {
        throw new UnauthorizedException()
      }

      const user = await this.prisma.user.findUnique({
        where: {
          email: decodedToken.payload.email,
        },
      });
      const userMermissions = await this.prisma.userPermission.findFirst({ where: { userId: user.id, restaurantId: user.restaurantId }, select: { permissions: true } });
      return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId, userMermissions.permissions);

    } catch (error) {
      throw new InternalServerErrorException(error)
    }

  }

  isTokenExpired = (decodedToken: any) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDifference = currentTimestamp - decodedToken.payload.exp;
    return timeDifference > 60;
  };

  async signToken(userId: number, email: string, userType: number, restaurantId: number, permissions: string = ""): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      userType,
      restaurantId,
      permissions: permissions.split(',')
    };
    const secret = 'wowthisisabadsecret123'; //this.config.get('JWT_SECRET');

    try {
      const token = await this.jwt.signAsync(payload,
        {
          expiresIn: '1hr',
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

  async forgotPassword(dto: ForgotPasswordDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    // if user does not exist throw exception
    if (!user)
      throw new ForbiddenException('Invalid Email');

    //Generate random token

    const tokenResult = await this.GenerateToken();

    //Save hashedToken
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetToken: tokenResult.hashedToken,
      },
    });

    //Implement Logic to send mail
    return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
  }

  async GenerateToken(): Promise<{ token: string, hashedToken: string }> {

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await argon.hash(token);

    return { token, hashedToken }
  }

}