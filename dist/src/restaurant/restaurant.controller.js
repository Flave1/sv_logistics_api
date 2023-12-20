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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const common_1 = require("@nestjs/common");
const guard_1 = require("../auth/guard");
const restaurant_service_1 = require("./restaurant.service");
const dto_1 = require("./dto");
const swagger_1 = require("@nestjs/swagger");
let RestaurantController = class RestaurantController {
    constructor(restaurantService) {
        this.restaurantService = restaurantService;
    }
    getRestaurant() {
        return this.restaurantService.getRestaurants();
    }
    getRestaurantById(restaurantId) {
        return this.restaurantService.getRestaurantById(restaurantId);
    }
    createRestaurant(dto) {
        return this.restaurantService.createRestaurant(dto);
    }
    editRestaurantById(restaurantId, dto) {
        return this.restaurantService.editRestaurantById(restaurantId, dto);
    }
    deleteRestaurantById(restaurantId) {
        return this.restaurantService.deleteRestaurantById(restaurantId);
    }
};
exports.RestaurantController = RestaurantController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "getRestaurant", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "getRestaurantById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRestaurantDto]),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "createRestaurant", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.EditRestaurantDto]),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "editRestaurantById", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "deleteRestaurantById", null);
exports.RestaurantController = RestaurantController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, swagger_1.ApiTags)('Restaurant'),
    (0, common_1.Controller)('restaurant'),
    __metadata("design:paramtypes", [restaurant_service_1.RestaurantService])
], RestaurantController);
//# sourceMappingURL=restaurant.controller.js.map