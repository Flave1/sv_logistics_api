import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { CreateCustomerDto } from './dto/create.customer.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from './decorator/get-user.decorator';
import { CreateStaffDto } from './dto/create.staff.dto';
import { CreateDriverDto } from './dto/create.driver.dto';
import { JwtGuard } from './guard/jwt.guard';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiCreatedResponse({ description: "Customer successfully created" })
  @Post('create-customer')
  createCustomer(@Body() dto: CreateCustomerDto) {
    return this.authService.CreateCustomer(dto);
  }


  //** Method to profile Staff*/
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "Staff successfully created" })
  @UseGuards(JwtGuard)
  @Post('create-staff')
  createStaff(@GetUser('restaurantId') restaurantId: string, @Body() dto: CreateStaffDto) {
    return this.authService.CreateStaff(restaurantId, dto);
  }

  //** Method to profile Driver*/
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "Driver successfully created" })
  @UseGuards(JwtGuard)
  @Post('create-driver')
  createDriver(@GetUser('restaurantId') restaurantId: string, @Body() dto: CreateDriverDto) {
    return this.authService.CreateDriver(restaurantId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signin(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}