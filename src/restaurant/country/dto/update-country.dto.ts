import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateCountryDto {
    @ApiProperty()
    @IsNumber()
    id: number;
    
    @ApiProperty({})
    @IsString()
    countryName: string;

    @ApiProperty({})
    @IsString()
    countryCode: string;

    @ApiProperty({})
    @IsString()
    currencyName: string;

    @ApiProperty({})
    @IsString()
    currencyCode: string;

    @ApiProperty({})
    @IsOptional()
    @IsBoolean()
    status: boolean;
  }