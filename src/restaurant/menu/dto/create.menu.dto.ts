import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsOptional,
    IsString
  } from 'class-validator';
  
  export class CreateMenuDto {
    @ApiProperty({})
    @IsString()
    name: string;
  
    @ApiProperty({})
    @IsString()
    menuSubCategoryId: string;
  
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