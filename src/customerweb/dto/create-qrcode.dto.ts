import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";


export class CreateQrCodeDto {
    @ApiProperty({})
    @IsArray()
    table: string[];
}