import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateMenuOrderDto {
    @ApiProperty({})
    @IsString()
    customerId: string;

    @ApiProperty({})
    @IsString()
    restaurantId: string;

    @ApiProperty({})
    @IsString()
    menuId: string;

    @ApiProperty({})
    @IsString()
    quantity: string;

    @ApiProperty({})
    @IsNumber()
    status: number;
  }