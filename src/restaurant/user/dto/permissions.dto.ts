import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";


export class SavePermissionRequest {
    @ApiProperty({})
    @IsArray()
    @IsNotEmpty()
    permissions: string[];

    @ApiProperty({})
    @IsNumber()
    @IsNotEmpty()
    type: number;

    @ApiProperty({})
    @IsNumber()
    @IsNotEmpty()
    userId: number;

}

export class PermissionsDTO {
    permissions: string[];
    type: number;
    userId: number;

}