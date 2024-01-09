import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";



export class EditAddressDto {
    @ApiProperty({})
    @IsNumber()
    id: number;

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    latitude: string;

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    longitude: string;

    @ApiProperty({})
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @ApiProperty({})
    @IsBoolean()
    isDefault: boolean;
}

export class CreateAddressDto {
    id: number;

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    latitude: string;

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    longitude: string;

    @ApiProperty({})
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @ApiProperty({})
    @IsBoolean()
    isDefault: boolean;
}

export class AddressDto {
    id: number;
    label: string;
    name: string;
    latitude: string;
    longitude: string;
    customerId: number;
    isDefault: boolean;
}