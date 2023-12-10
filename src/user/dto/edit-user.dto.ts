import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class EditUserDto {
    @IsString()
    @IsOptional()
    firstName?: string;
  
    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    otherPhoneNumber?: string;

    @IsString()
    @IsOptional()
    address?: string;
    
    @IsString()
    @IsOptional()
    nextOfKinName?: string;

    @IsString()
    @IsOptional()
    nextOfKinPhoneNumber?: string;

    @IsString()
    @IsOptional()
    nextOfKinAddress?: string;
  }