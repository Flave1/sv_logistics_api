import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @Get()
  getMe(@GetUser() user: User) {
    return user;
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
