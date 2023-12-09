import {
    IsEmail,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateCustomerDto {
    @IsEmail()
    email?: string;
  
    @IsString()
    firstName?: string;
  
    @IsString()
    lastName?: string;

    @IsString()
    password?: string;

    @IsString()
    PhoneNumber?: string;

    @IsString()
    Address?: string;


  }