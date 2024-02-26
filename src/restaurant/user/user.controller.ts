import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../../auth/decorator';
import { JwtGuard } from '../../auth/guard';
import { EditUserDto, SavePermissionRequest } from './dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Request, Response } from 'express'
import { DeleteDto } from 'src/dto/delete.dto';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @Get('me')
  getMe(@GetUser() user: User, req: Request) {
    return user;
  }
 
  @Get('all')
  getAll() {
    return this.userService.getAllUsers();
  }
  @Put(':id/update-staff')
  editStaff(@GetUser('restaurantId') restaurantId: string, @Body() dto: EditUserDto, @Param('id') id: string) {
    return this.userService.updateStaffUser(parseInt(id), dto, restaurantId);
  }

  @Post("update-driver")
  editDriver(@GetUser('restaurantId') restaurantId: string, @Body() dto: EditUserDto, @Param('id') id: string) {
    return this.userService.updateDriverUser(parseInt(id), dto, restaurantId);
  }

  // @Get(':id')
  // getUserById(@Param('id') userId: string) {
  //   return this.userService.getUserById(userId);
  // }

  @Get('get-staff/:id')
  getStaffUser(@Param('id') id: string) {
    return this.userService.getUserByStaffId(id);
  }

  @Get('get-driver/:id')
  getDriverUser(@Param('id') id: string) {
    return this.userService.getUserByDriverId(id);
  }

  @Get('restaurant/:restaurantId')
  getUserByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.userService.getUserByRestaurantId(restaurantId);
  }

  @Get('staff')
  async getStaff(@GetUser('restaurantId') restaurantId: string, res: Response) {
    try {
      return await this.userService.getRestaurantStaff(restaurantId)
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

  @ApiOkResponse({ description: "User deleted successfully" })
  @Post('delete')
  async deleteById(@GetUser('restaurantId') restaurantId: string, @Body() dto: DeleteDto) {
    return await this.userService.deleteById(dto, restaurantId);
  }

  @Post('permission')
  async savePermissions(@GetUser('restaurantId') restaurantId: string, @Body() request: SavePermissionRequest) {
    return await this.userService.savePermissions(restaurantId, request);
  }
  @Get('permission/:userId/:type')
  async getPermissions(@GetUser('restaurantId') restaurantId: string, @Param('userId') userId: string, @Param('type') type: string) {
    return await this.userService.getPermissions(restaurantId, parseInt(userId), parseInt(type));
  }
}
