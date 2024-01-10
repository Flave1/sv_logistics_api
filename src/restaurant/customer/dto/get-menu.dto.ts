import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class MenuOrderDto {
    customerId?: string;
    temporalId: string;
    restaurantId: string;
    restaurantName: string;
    menuId: string;
    menuName: string;
    menuImage: string;
    quantity: string;
    status: number;
    statuslable: string
    price: number;
  }
  
  export class CheckoutFinalMenuRequest {
    @ApiProperty({})
    @IsArray()
    restaurantIds: number[];
  
    @ApiProperty({})
    @IsArray()
    menuIds: number[]

  }

  export class MenuDto {
    restaurantId: number;
    id: number;
    name: string;
    image: string;
    price: number;
  }

