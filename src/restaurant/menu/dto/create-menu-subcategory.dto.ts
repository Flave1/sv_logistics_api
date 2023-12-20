import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsOptional,
    IsString,
    isBoolean,
    isString
  } from 'class-validator';
  
  export class CreateMenuSubCategoryDto {
    @ApiProperty({})
    @IsString()
    name: string;
  
    @ApiProperty({})
    @IsString()
    description: string;

    @ApiProperty({})
    @IsOptional()
    @IsString()
    status: boolean;

    @ApiProperty({})
    @IsString()
    menuCategory: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  }