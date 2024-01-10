import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsBoolean,
    IsEmail
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateClientDto {
    @ApiProperty({})
    @IsEmail()
    email: string;
    
    @ApiProperty({})
    @IsString()
    firstName: string;

    @ApiProperty({})
    @IsString()
    lastName: string;

    @ApiProperty({})
    @IsString()
    phoneNumber: string;

    @ApiProperty({})
    @IsString()
    address: string;
  }