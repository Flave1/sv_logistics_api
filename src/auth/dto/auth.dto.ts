import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
  } from 'class-validator';
  
  export class AuthDto {
    @ApiProperty({})
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    password: string;
  }

  export class refreshTokenRequest{
    @ApiProperty({})
    @IsNotEmpty()
    @IsString()
    token: string;
  }