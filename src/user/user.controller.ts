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
  import { GetUser } from '../auth/decorator';
  import { JwtGuard } from '../auth/guard';
  import { AuthGuard } from '@nestjs/passport';
  import { Request } from 'express';
  import { EditUserDto } from './dto';
  import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiTags('Users')
  @Controller('users')
  export class UserController {
    constructor(
       private userService: UserService
        ) {}

    @Get('me')
    getMe(@Req() req: Request) {
      return req.user;
    }

    @Get('all')
    getAll() {
      return this.userService.getAllUsers();
    }

    @Patch("update/:id")
    editUser(@Param('id') userId: string, @Body() dto: EditUserDto) {
      return this.userService.updateUser(userId, dto);
    }

    @Get(':id')
    getUserById(@Param('id') userId: string) {
        return this.userService.getUserById(userId);
    }

    @Get('restaurant/:restaurantId')
    getUserByRestaurantId(@Param('restaurantId') restaurantId: string) {
        return this.userService.getUserByRestaurantId(restaurantId);
    }

  }