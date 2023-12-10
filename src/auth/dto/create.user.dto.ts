import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    isNumber,
    isString,
  } from 'class-validator';
  
  export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email?: string;
  
    @ApiProperty()
    @IsString()
    firstName?: string;
  
    @ApiProperty()
    @IsString()
    lastName?: string;

    @ApiProperty()
    @IsString()
    password?: string;

    @ApiProperty()
    @IsString()
    phoneNumber?: string;

    @ApiProperty()
    @IsString()
    address?: string;

    @ApiProperty()
    @IsNumber()
    restaurantId: number;

    @ApiProperty()
    @IsNumber()
    userType: number;

    @ApiProperty()
    @IsNumber()
    courierType: number;

  }