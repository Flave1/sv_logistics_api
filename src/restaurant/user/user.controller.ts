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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { NextFunction, Request, Response } from 'express'
import { DeleteUserDto } from './dto/delete.user.dto';
  
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

  @Get('drivers')
  async getDrivers(@GetUser('restaurantId') restaurantId: string, res: Response) {
  try {
    return await this.userService.getRestaurantDrivers(restaurantId)
    // res.status(200).json(response)
  } catch (error) {
    console.log('error', error);
  }
  }

  @Get('customers')
  async getCustomers(@GetUser('restaurantId') restaurantId: string, res: Response) {
  try {
    return await this.userService.getRestaurantCustomers(restaurantId)
    // res.status(200).json(response)
  } catch (error) {
    console.log('error', error);
  }
  }

  @ApiOkResponse({description: "User deleted successfully"})
  @Post('delete/:id')
  async deleteById(@Body() dto: DeleteUserDto, res: Response) {
    const response = await this.userService.deleteById(dto);
  }

}
