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
exports.RestaurantController = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("@nestjs/platform-express/multer");
const guard_1 = require("../auth/guard");
const restaurant_service_1 = require("./restaurant.service");
const dto_1 = require("./dto");
const swagger_1 = require("@nestjs/swagger");
const multer_2 = require("multer");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const utils_1 = require("../utils");
const delete_dto_1 = require("../dto/delete.dto");
const decorator_1 = require("../auth/decorator");
const qrcode_dto_1 = require("./dto/qrcode.dto");
const restaurantDestination = './src/uploads/restaurant';
let RestaurantController = class RestaurantController {
    constructor(restaurantService) {
        this.restaurantService = restaurantService;
    }
    async getStatistics(restaurantId) {
        const response = await this.restaurantService.getDasboardStats(parseInt(restaurantId));
        return response;
    }
    async getRestaurant(req) {
        const response = await this.restaurantService.getRestaurants();
        for (let i = 0; i < response.length; i++) {
            response[i].image = (0, utils_1.getBaseUrl)(req) + '/' + response[i].image;
        }
        return response;
    }
    async getRestaurantById(restaurantId, req) {
        const response = await this.restaurantService.getRestaurantById(restaurantId);
        response.image = (0, utils_1.getBaseUrl)(req) + '/' + response.image;
        return response;
    }
    createRestaurant(file, dto) {
        return this.restaurantService.createRestaurant(dto, file);
    }
    editRestaurantById(file, dto) {
        return this.restaurantService.editRestaurantById(dto, file);
    }
    deleteRestaurant(dto) {
        return this.restaurantService.deleteRestaurantById(dto);
    }
    async createQrCode(restaurantId, dto, req) {
        return this.restaurantService.CreateQrCode(restaurantId, dto, req);
    }
};
exports.RestaurantController = RestaurantController;
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, decorator_1.GetUser)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "getRestaurant", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "getRestaurantById", null);
__decorate([
    (0, common_1.UseInterceptors)((0, multer_1.FileInterceptor)('file', {
        storage: (0, multer_2.diskStorage)({
            destination: restaurantDestination,
            filename: (req, file, cb) => {
                const filename = (0, uuid_1.v4)();
                const extension = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            }
        })
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateRestaurantDto]),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "createRestaurant", null);
__decorate([
    (0, common_1.UseInterceptors)((0, multer_1.FileInterceptor)('file', {
        storage: (0, multer_2.diskStorage)({
            destination: restaurantDestination,
            filename: (req, file, cb) => {
                const filename = path.parse(file.originalname).name.replace(/\s/g, '') + (0, uuid_1.v4)();
                const extension = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            }
        })
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.EditRestaurantDto]),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "editRestaurantById", null);
__decorate([
    (0, common_1.Post)('delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_dto_1.DeleteDto]),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "deleteRestaurant", null);
__decorate([
    (0, common_1.Post)('create-qrcode'),
    __param(0, (0, decorator_1.GetUser)('restaurantId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, qrcode_dto_1.CreateQrCodeDto, Object]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "createQrCode", null);
exports.RestaurantController = RestaurantController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, swagger_1.ApiTags)('Restaurant'),
    (0, common_1.Controller)('restaurant'),
    __metadata("design:paramtypes", [restaurant_service_1.RestaurantService])
], RestaurantController);
//# sourceMappingURL=restaurant.controller.js.map