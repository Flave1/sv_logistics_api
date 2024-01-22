import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean } from "class-validator";


export class CreateQrCodeDto {

    @ApiProperty({})
    @IsBoolean()
    isSequential: boolean;

    @ApiProperty({})
    @IsArray()
    table: string[];
}