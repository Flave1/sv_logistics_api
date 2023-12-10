import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { AuthDto } from './dto';
import { CreateCustomerDto } from './dto/create.customer.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
  
@ApiTags('Authentication')
  @Controller('Authentication')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @ApiCreatedResponse({description: "Customer successfully created"})
    @Post('create-customer')
    createCustomer(@Body() dto: CreateCustomerDto) {
      return this.authService.CreateCustomer(dto);
    }
    
    //** Method to profile Staff and Drivers */
    @ApiCreatedResponse({description: "User successfully created"})
    @Post('create-user')
    creatUser(@Body() dto: CreateUserDto) {
      return this.authService.CreateUser(dto);
    }
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signin(@Body() dto: AuthDto) {
      return this.authService.login(dto);
    }
  }