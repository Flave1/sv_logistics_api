import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    isNumber,
    isString,
  } from 'class-validator';
  
  export class CreateStaffDto {
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

  }