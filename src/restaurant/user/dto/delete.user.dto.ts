import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class DeleteUserDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    userId?: string;
  }