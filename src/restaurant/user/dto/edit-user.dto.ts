import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class EditUserDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName?: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    otherPhoneNumber?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    address?: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    nextOfKinName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    nextOfKinPhoneNumber?: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    nextOfKinAddress?: string;
  }