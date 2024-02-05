import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class OrderQuery {
    orderStatus: number;
    paymentStatus: number;
    orderDate: null;
}

export class OrderSearch {
    search: number;
}

export class OrderAcceptRequest {
    
    @ApiProperty()
    @IsNumber()
    checkoutOrderId: number;
}