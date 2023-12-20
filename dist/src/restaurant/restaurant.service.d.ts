import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto, EditRestaurantDto } from './dto';
export declare const cached_restaurants = "cached_restaurants";
export declare class RestaurantService {
    private prisma;
    constructor(prisma: PrismaService);
    getRestaurantById(restaurantId: number): import(".prisma/client").Prisma.Prisma__RestaurantClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deleted: boolean;
        status: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    getRestaurants(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deleted: boolean;
        status: boolean;
    }[]>;
    createRestaurant(dto: CreateRestaurantDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deleted: boolean;
        status: boolean;
    }>;
    editRestaurantById(restaurantId: number, dto: EditRestaurantDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deleted: boolean;
        status: boolean;
    }>;
    deleteRestaurantById(restaurantId: number): Promise<void>;
}
