import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsEmail
  } from 'class-validator';
  
  export class EditRestaurantDto {
    @ApiProperty()
    @IsString()
    id: string;
    
    @ApiProperty({})
    @IsString()
    name: string;

    @ApiProperty({})
    @IsString()
    description: string;

    @ApiProperty({})
    @IsEmail()
    email: string;

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

    @ApiProperty({})
    @IsString()
    latitude: string;

    @ApiProperty({})
    @IsString()
    longitude: string;

    @ApiProperty({})
    @IsString()
    countryId: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  }