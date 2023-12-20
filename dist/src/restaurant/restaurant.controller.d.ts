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
    }[]>;
    getRestaurantById(restaurantId: number): import(".prisma/client").Prisma.Prisma__RestaurantClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createRestaurant(dto: CreateRestaurantDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    editRestaurantById(restaurantId: number, dto: EditRestaurantDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    deleteRestaurantById(restaurantId: number): Promise<void>;
}
