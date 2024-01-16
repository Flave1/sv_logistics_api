"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const create_qrcode_dto_1 = require("./customerweb/dto/create-qrcode.dto");
const utils_2 = require("../utils");
const qrcode = __importStar(require("qrcode"));
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
    async CreateQrCode(restaurantId, dto, req) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id: parseInt(restaurantId),
            },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(enums_1.StatusMessage.NoRecord);
        }
        let menuPage, qrText, qrPath, savePath;
        let qrCodes = [];
        if (dto.table.length == 0) {
            menuPage = `${(0, utils_2.getBaseUrl)(req)}/${restaurant.name.replace(" ", "-")}/${restaurantId}/menu`;
            const base64Image = await this.generateQrCodeImage(menuPage);
            qrCodes.push(base64Image);
        }
        else {
            for (let i = 0; i < dto.table.length; i++) {
                menuPage = `${(0, utils_2.getBaseUrl)(req)}/${restaurant.name.replace(" ", "-")}/${restaurantId}/menu/${dto.table[i]}`;
                const base64Image = await this.generateQrCodeImage(menuPage);
                qrCodes.push(base64Image);
            }
        }
        return qrCodes;
    }
    async generateQrCodeImage(text) {
        return qrcode.toDataURL(text);
    }
};
exports.RestaurantService = RestaurantService;
__decorate([
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_qrcode_dto_1.CreateQrCodeDto, Object]),
    __metadata("design:returntype", Promise)
], RestaurantService.prototype, "CreateQrCode", null);
exports.RestaurantService = RestaurantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gateway_service_1.GatewayService])
], RestaurantService);
//# sourceMappingURL=restaurant.service.js.map