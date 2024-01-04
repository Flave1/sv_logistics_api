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
import { deleteFile, fileExist } from "src/utils";

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

    async createRestaurant(dto: CreateRestaurantDto, file: Express.Multer.File) {
        const hasFreeDelivery = dto.hasFreeDelivery.toString().toLowerCase() == 'true' ? true : false;
        const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
        const restaurant =
            await this.prisma.restaurant.create({
                data: {
                    name: dto.name,
                    phoneNumber: dto.phoneNumber,
                    address: dto.address,
                    description: dto.description,
                    email: dto.email,
                    image: file.path,
                    openingTime: dto.openingTime,
                    closingTime: dto.closingTime,
                    hasFreeDelivery: hasFreeDelivery,
                    freeDeliveryAmount: dto.freeDeliveryAmount,
                    status: status,
                    deleted: false,
                    clientId: parseInt(dto.clientId)
                },
            });
        // await this.redis.updateList(cached_restaurants, restaurant);
        return restaurant;
    }




    async editRestaurantById(
        dto: EditRestaurantDto,
        file: Express.Multer.File
    ) {
        const restaurant =
            await this.prisma.restaurant.findUnique({
                where: {
                    id: parseInt(dto.id),
                    deleted: false
                },
            });

        if (!restaurant)
            throw new NotFoundException('Item not found');


        if (file && await fileExist(restaurant.image)) {
            await deleteFile(restaurant.image)
        }
        const hasFreeDelivery = dto.hasFreeDelivery.toString().toLowerCase() == 'true' ? true : false;
        const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
        return this.prisma.restaurant.update({
            where: {
                id: parseInt(dto.id),
            },
            data: {
                name: dto.name,
                phoneNumber: dto.phoneNumber,
                address: dto.address,
                description: dto.description,
                email: dto.email,
                image: file.path,
                openingTime: dto.openingTime,
                closingTime: dto.closingTime,
                hasFreeDelivery: hasFreeDelivery,
                freeDeliveryAmount: dto.freeDeliveryAmount,
                status: status
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