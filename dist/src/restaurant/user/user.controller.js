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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const decorator_1 = require("../../auth/decorator");
const guard_1 = require("../../auth/guard");
const dto_1 = require("./dto");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
const delete_dto_1 = require("../../dto/delete.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getMe(user, req) {
        return user;
    }
    getAll() {
        return this.userService.getAllUsers();
    }
    editStaff(dto) {
        return this.userService.updateStaffUser(dto.id, dto);
    }
    editDriver(dto) {
        return this.userService.updateDriverUser(dto.id, dto);
    }
    getStaffUser(id) {
        return this.userService.getUserByStaffId(id);
    }
    getDriverUser(id) {
        return this.userService.getUserByDriverId(id);
    }
    getUserByRestaurantId(restaurantId) {
        return this.userService.getUserByRestaurantId(restaurantId);
    }
    async getStaff(restaurantId, res) {
        try {
            return await this.userService.getRestaurantStaff(restaurantId);
        }
        catch (error) {
            console.log('error', error);
        }
    }
    async getDrivers(restaurantId, res) {
        try {
            return await this.userService.getRestaurantDrivers(restaurantId);
        }
        catch (error) {
            console.log('error', error);
        }
    }
    async getCustomers(restaurantId, res) {
        try {
            return await this.userService.getRestaurantCustomers(restaurantId);
        }
        catch (error) {
            console.log('error', error);
        }
    }
    async deleteById(dto) {
        return await this.userService.deleteById(dto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)("update-staff"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.EditUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "editStaff", null);
__decorate([
    (0, common_1.Post)("update-driver"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.EditUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "editDriver", null);
__decorate([
    (0, common_1.Get)('get-staff/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getStaffUser", null);
__decorate([
    (0, common_1.Get)('get-driver/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getDriverUser", null);
__decorate([
    (0, common_1.Get)('restaurant/:restaurantId'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserByRestaurantId", null);
__decorate([
    (0, common_1.Get)('staff'),
    __param(0, (0, decorator_1.GetUser)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getStaff", null);
__decorate([
    (0, common_1.Get)('drivers'),
    __param(0, (0, decorator_1.GetUser)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDrivers", null);
__decorate([
    (0, common_1.Get)('customers'),
    __param(0, (0, decorator_1.GetUser)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCustomers", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: "User deleted successfully" }),
    (0, common_1.Post)('delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_dto_1.DeleteDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteById", null);
exports.UserController = UserController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map