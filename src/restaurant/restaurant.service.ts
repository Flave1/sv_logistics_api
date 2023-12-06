import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateRestaurantDto,
    EditRestaurantDto,
} from './dto';

@Injectable()
export class RestaurantService {
    constructor(private prisma: PrismaService) { }


    getRestaurantById(
        restaurantId: number,
    ) {
        return this.prisma.restaurant.findFirst({
            where: {
                id: restaurantId
            },
        });
    }

    async createRestaurant(
        dto: CreateRestaurantDto,
    ) {
        const restaurant =
            await this.prisma.restaurant.create({
                data: {
                    name: dto.name
                },
            });

        return restaurant;
    }


    

    async editRestaurantById(
        restaurantId: number,
        dto: EditRestaurantDto,
    ) {
        const restaurant =
            await this.prisma.restaurant.findUnique({
                where: {
                    id: restaurantId,
                },
            });

        if (!restaurant || restaurant.id !== restaurantId)
            throw new NotFoundException('Item not found');

        return this.prisma.restaurant.update({
            where: {
                id: restaurantId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deleteRestaurantById(restaurantId: number) {
        const restaurant =
            await this.prisma.restaurant.findUnique({
                where: {
                    id: restaurantId,
                },
            });

        await this.prisma.restaurant.delete({
            where: {
                id: restaurantId,
            },
        });
    }
}