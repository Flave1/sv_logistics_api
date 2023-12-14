import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    isNumber,
    isString,
  } from 'class-validator';
  
  export class CreateDriverDto {
    @ApiProperty({})
    @IsEmail()
    email?: string;
  
    @ApiProperty({})
    @IsString()
    firstName?: string;
  
    @ApiProperty({})
    @IsString()
    lastName?: string;

    @ApiProperty({})
    @IsString()
    phoneNumber?: string;

    @ApiProperty({})
    @IsString()
    address?: string;

    @ApiProperty({example: 1})
    @IsString()
    courierType: string;

  }