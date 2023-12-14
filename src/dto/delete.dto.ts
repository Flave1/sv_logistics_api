import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class DeleteDto {
    @ApiProperty()
    @IsArray()
    id: string[];
  }