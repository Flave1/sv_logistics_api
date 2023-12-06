import {
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class EditRestaurantDto {
    @IsString()
    @IsOptional()
    name?: string;
  }