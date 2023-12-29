import {
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateRestaurantDto {
    @ApiProperty({})
    @IsString()
    name: string;

    @ApiProperty({})
    @IsString()
    phoneNumber: string;

    @ApiProperty({})
    @IsString()
    address: string;

    @ApiProperty({})
    @IsString()
    openingTime: string;

    @ApiProperty({})
    @IsString()
    closingTime: string;

    @ApiProperty({})
    @IsString()
    hasFreeDelivery: boolean;

    @ApiProperty({})
    @IsString()
    freeDeliveryAmount: string;

    @ApiProperty({})
    @IsOptional()
    @IsString()
    status: boolean;
  }