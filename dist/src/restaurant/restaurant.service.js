"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = exports.cached_restaurants = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
exports.cached_restaurants = 'cached_restaurants';
let RestaurantService = class RestaurantService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getRestaurantById(restaurantId) {
        return this.prisma.restaurant.findFirst({
            where: {
                id: restaurantId
            },
        });
    }
    async getRestaurants() {
        const restaurants = await this.prisma.restaurant.findMany();
        return restaurants;
    }
    async createRestaurant(dto) {
        const restaurant = await this.prisma.restaurant.create({
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
        return restaurant;
    }
    async editRestaurantById(restaurantId, dto) {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: {
                id: restaurantId,
            },
        });
        if (!restaurant || restaurant.id !== restaurantId)
            throw new common_1.NotFoundException('Item not found');
        return this.prisma.restaurant.update({
            where: {
                id: restaurantId,
            },
            data: {
                ...dto,
            },
        });
    }
    async deleteRestaurantById(restaurantId) {
        const restaurant = await this.prisma.restaurant.findUnique({
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
};
exports.RestaurantService = RestaurantService;
exports.RestaurantService = RestaurantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RestaurantService);
//# sourceMappingURL=restaurant.service.js.map