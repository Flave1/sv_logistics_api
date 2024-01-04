import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsBoolean
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateCountryDto {
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