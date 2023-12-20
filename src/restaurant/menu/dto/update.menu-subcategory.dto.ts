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
  
  export class UpdateMenuSubCategoryDto {
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
    @IsString()
    menuCategory: string;

    @ApiProperty({})
    @IsOptional()
    @IsString()
    status: boolean;

    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  }