import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateCustomerDto {
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


  }