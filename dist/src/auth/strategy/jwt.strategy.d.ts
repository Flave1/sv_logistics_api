import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        hash: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        otherPhoneNumber: string;
        address: string;
        nextOfKinName: string;
        nextOfKinPhoneNumber: string;
        nextOfKinAddress: string;
        userTypeId: number;
        courierTypeId: number;
        restaurantId: number;
        passwordResetToken: string;
        deleted: boolean;
        status: boolean;
    }>;
}
export {};
