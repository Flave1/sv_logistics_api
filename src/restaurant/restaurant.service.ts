import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateRestaurantDto,
    EditRestaurantDto,
} from './dto';
import { RedisRepository } from 'src/redis/redis.repository';
import { Restaurant } from '@prisma/client';

export const cached_restaurants = 'cached_restaurants';
@Injectable()
export class RestaurantService {
    constructor(private prisma: PrismaService,
        // private redis: RedisRepository
    ) { }

    getRestaurantById(restaurantId: number) {
        return this.prisma.restaurant.findFirst({
            where: {
                id: restaurantId
            },
        });
    }

    async getRestaurants() {
        // const cachedData = await this.redis.getAll<Restaurant[]>(cached_restaurants);
        // if (cachedData) {
        //     console.log('gotten from cache');
        //     return cachedData;
        // }

        const restaurants = await this.prisma.restaurant.findMany();
        // await this.redis.store<Restaurant[]>({ key: cached_restaurants, data: restaurants });
        // console.log('gotten from db');
        return restaurants;
    }

    async createRestaurant(dto: CreateRestaurantDto) {
        const restaurant =
            await this.prisma.restaurant.create({
                data: {
                    name: dto.name,
                    phoneNumber: dto.phoneNumber,
                    address: dto.address,
                    openingTime: dto.openingTime,
                    closingTime: dto.closingTime,
                    hasFreeDelivery: dto.hasFreeDelivery,
                    freeDeliveryAmount: dto.freeDeliveryAmount,
                    status: dto.status
                },
            });
        // await this.redis.updateList(cached_restaurants, restaurant);
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