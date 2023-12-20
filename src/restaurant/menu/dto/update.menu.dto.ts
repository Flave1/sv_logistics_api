import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    isBoolean,
    isString
  } from 'class-validator';
  
  export class UpdateMenuDto {
    @ApiProperty()
    @IsString()
    id: string;
    
    @ApiProperty({})
    @IsString()
    name: string;
  
    @ApiProperty({})
    @IsString()
    menuCategoryId: string;
  
    @ApiProperty({})
    @IsString()
    description: string;

    @ApiProperty({})
    @IsString()
    price: string;

    @ApiProperty({})
    @IsOptional()
    @IsString()
    availability: boolean;

    @ApiProperty({})
    @IsOptional()
    @IsString()
    status: boolean;

    @ApiProperty({})
    @IsString()
    @IsOptional()
    discount?: string;

    @ApiProperty({})
    @IsString()
    @IsOptional()
    dietaryInformation?: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  }