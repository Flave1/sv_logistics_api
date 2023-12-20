import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, EditRestaurantDto } from './dto';
export declare class RestaurantController {
    private restaurantService;
    constructor(restaurantService: RestaurantService);
    getRestaurant(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deleted: boolean;
        status: boolean;
    }[]>;
    getRestaurantById(restaurantId: number): import(".prisma/client").Prisma.Prisma__RestaurantClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deleted: boolean;
        status: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
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
