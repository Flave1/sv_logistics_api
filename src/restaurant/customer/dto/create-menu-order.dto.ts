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

  @ApiProperty({})
  @IsString()
  temporalId: ''
}

export class MenuOrderDto {
  customerId: string;
  temporalId: string;
  restaurantId: string;
  restaurantName: string;
  menuId: string;
  menuName: string;
  quantity: string;
  status: number;
  statuslable: string
}