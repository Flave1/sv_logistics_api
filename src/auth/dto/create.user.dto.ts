import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    isNumber,
    isString,
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsEmail()
    email?: string;
  
    @IsString()
    firstName?: string;
  
    @IsString()
    lastName?: string;

    @IsString()
    password?: string;

    @IsString()
    phoneNumber?: string;

    @IsString()
    address?: string;

    @IsNumber()
    restaurantId: number;

    @IsNumber()
    userType: number;

    @IsNumber()
    courierType: number;

  }