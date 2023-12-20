import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from 'src/auth/dto/create.customer.dto';
import { GatewayService } from 'src/gateway/gateway.service';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { CreateDriverDto } from './dto/create.driver.dto';
import { CreateStaffDto } from './dto/create.staff.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    private socket;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, socket: GatewayService);
    CreateCustomer(dto: CreateCustomerDto): Promise<{
        access_token: string;
    }>;
    CreateStaff(restaurantId: string, dto: CreateStaffDto): Promise<{
        access_token: string;
    }>;
    CreateDriver(restaurantId: string, dto: CreateDriverDto): Promise<{
        access_token: string;
    }>;
    login(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    signToken(userId: number, email: string, userType: number, restaurantId: number): Promise<{
        access_token: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        access_token: string;
    }>;
    GenerateToken(): Promise<{
        token: string;
        hashedToken: string;
    }>;
}
