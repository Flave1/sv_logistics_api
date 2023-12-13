import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { User } from '@prisma/client';
  import { GetUser } from '../../auth/decorator';
  import { JwtGuard } from '../../auth/guard';
  import { AuthGuard } from '@nestjs/passport';
  import { EditUserDto } from './dto';
  import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { NextFunction, Request, Response } from 'express'
  
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiTags('Users')
  @Controller('users')
  export class UserController {
    constructor(
       private userService: UserService
        ) {}

    @Get('me')
    getMe(@GetUser() user: User, req: Request) {
      return user;
    }

    @Get('all')
    getAll() {
      return this.userService.getAllUsers();
    }

  @Patch("update/:id")
  editUser(@Param('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.updateUser(userId, dto);
  }

  // @Get(':id')
  // getUserById(@Param('id') userId: string) {
  //   return this.userService.getUserById(userId);
  // }

  @Get('get-staff/:id')
  getStaffUser(@Param('id') id: string) {
    return this.userService.getUserByStaffId(id);
  }

  @Get('restaurant/:restaurantId')
  getUserByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.userService.getUserByRestaurantId(restaurantId);
  }

  @Get('staff')
  async getStaff(@GetUser('restaurantId') restaurantId: string, res: Response) {
  try {
    return await this.userService.getRestaurantStaff(restaurantId)
    // res.status(200).json(response)
  } catch (error) {
    console.log('error', error);
  }
  }

}
