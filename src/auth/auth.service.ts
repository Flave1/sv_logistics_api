import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { AuthDto } from './dto';
  import * as argon from 'argon2';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Restaurant } from 'src/restaurant/enums/restaurant.enum';
import { UserType } from 'src/user/enums/userType.enum';
import { CourierType } from 'src/user/enums/courierType.enum';
import { CreateCustomerDto } from 'src/auth/dto/create.customer.dto';
import { CreateUserDto } from './dto/create.user.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwt: JwtService,
      private config: ConfigService,
    ) {}
  
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
  
        return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
      } catch (error) {
        if (
          error instanceof
          PrismaClientKnownRequestError
        ) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'Email already exist',
            );
          }
        }
        throw error;
      }
    }

    //** Method to profile Staff and Drivers */
    async CreateUser(dto: CreateUserDto) {
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
              restaurantId: dto.restaurantId,
              userTypeId: dto.userType,
              courierTypeId: dto.courierType
          },
        });
  
        return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
      } catch (error) {
        if ( error instanceof PrismaClientKnownRequestError ) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'Email already exist',
            );
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
        throw new ForbiddenException(
          'Invalid Credentials',
        );
      return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
    }
  
    async signToken(
      userId: number,
      email: string,
      userType: number,
      restaurantId: number
    ): Promise<{ access_token: string }> {
      const payload = {
        sub: userId,
        email,
        userType,
        restaurantId
      };
      const secret = this.config.get('JWT_SECRET');
  
      const token = await this.jwt.signAsync(
        payload,
        {
          expiresIn: '60m',
          secret: secret,
        },
      );
  
      return {
        access_token: token,
      };
    }
  }