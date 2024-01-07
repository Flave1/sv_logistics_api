import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveMenuOrderDto {
  @ApiProperty({})
  customerId?: number;

  @ApiProperty({})
  @IsNumber()
  restaurantId: number;

  @ApiProperty({})
  @IsNumber()
  menuId: number;

  @ApiProperty({})
  @IsNumber()
  quantity: number;

  @ApiProperty({})
  @IsNumber()
  status: number;

  @ApiProperty({})
  @IsString()
  temporalId: string
}

export class MenuOrderDto {
  customerId?: string;
  temporalId: string;
  restaurantId: string;
  restaurantName: string;
  menuId: string;
  menuName: string;
  quantity: string;
  status: number;
  statuslable: string
  price: number;
}