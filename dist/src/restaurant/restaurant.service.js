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
const utils_1 = require("../utils");
const api_response_1 = require("../dto/api-response");
const enums_1 = require("./enums");
const gateway_service_1 = require("../gateway/gateway.service");
const dto_1 = require("../gateway/dto");
exports.cached_restaurants = 'cached_restaurants';
let RestaurantService = class RestaurantService {
    constructor(prisma, socket) {
        this.prisma = prisma;
        this.socket = socket;
    }
    getRestaurantById(restaurantId) {
        return this.prisma.restaurant.findFirst({
            where: {
                id: restaurantId
            },
        });
    }
    async getRestaurants() {
        const restaurants = await this.prisma.restaurant.findMany({
            where: {
                deleted: false
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        });
        return restaurants;
    }
    async createRestaurant(dto, file) {
        const hasFreeDelivery = dto.hasFreeDelivery.toString().toLowerCase() == 'true' ? true : false;
        const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
        const restaurant = await this.prisma.restaurant.create({
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
                clientId: parseInt(dto.clientId),
                latitude: dto.latitude,
                longitude: dto.longitude,
                countryId: parseInt(dto.countryId)
            },
        });
        this.socket.emitToClient(dto_1.RestaurantManagementEvents.get_restaurants_event);
        return restaurant;
    }
    async editRestaurantById(dto, file) {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: {
                id: parseInt(dto.id),
                deleted: false
            },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Item not found');
        if (file && await (0, utils_1.fileExist)(restaurant.image)) {
            await (0, utils_1.deleteFile)(restaurant.image);
        }
        const hasFreeDelivery = dto.hasFreeDelivery.toString().toLowerCase() == 'true' ? true : false;
        const status = dto.status.toString().toLowerCase() == 'true' ? true : false;
        this.socket.emitToClient(dto_1.RestaurantManagementEvents.get_restaurants_event);
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
                status: status,
                latitude: dto.latitude,
                longitude: dto.longitude,
                countryId: parseInt(dto.countryId)
            },
        });
    }
    async deleteRestaurantById(dto) {
        try {
            const restaurant = await this.prisma.restaurant.updateMany({
                where: {
                    id: {
                        in: dto.id.map(id => parseInt(id)),
                    }
                },
                data: {
                    deleted: true
                },
            });
            this.socket.emitToClient(dto_1.RestaurantManagementEvents.get_restaurants_event);
            return new api_response_1.APIResponse(enums_1.Status.Success, enums_1.StatusMessage.Deleted, null);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.RestaurantService = RestaurantService;
exports.RestaurantService = RestaurantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gateway_service_1.GatewayService])
], RestaurantService);
//# sourceMappingURL=restaurant.service.js.map