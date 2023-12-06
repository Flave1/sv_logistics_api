import {
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateRestaurantDto {
    @IsString()
    @IsOptional()
    name?: string;
  }