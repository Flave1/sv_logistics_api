import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { CreateCustomerDto } from './dto/create.customer.dto';
import { CreateStaffDto } from './dto/create.staff.dto';
import { CreateDriverDto } from './dto/create.driver.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    createCustomer(dto: CreateCustomerDto): Promise<{
        access_token: string;
    }>;
    createStaff(restaurantId: string, dto: CreateStaffDto): Promise<{
        access_token: string;
    }>;
    createDriver(restaurantId: string, dto: CreateDriverDto): Promise<{
        access_token: string;
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
}
