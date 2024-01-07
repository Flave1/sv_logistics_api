import {
  IsArray,
  IsNumber,
  IsString,
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
  @IsString()
  temporalId: string
}

export class RemoveMenuOrderDto {
  @ApiProperty({})
  customerId?: number;

  @ApiProperty({})
  @IsNumber()
  menuId: number;

  @ApiProperty({})
  @IsString()
  temporalId: string
}
