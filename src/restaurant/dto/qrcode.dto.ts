import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsString } from "class-validator";


export class CreateQrCodeDto {
    @ApiProperty({})
    @IsString()
    clientUrl: string[];

    @ApiProperty({})
    @IsArray()
    table: string[];
}

export class QrcodeResponse {
    table: string;
    qrcode: string;
}