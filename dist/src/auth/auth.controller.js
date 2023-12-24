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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
const create_customer_dto_1 = require("./dto/create.customer.dto");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("./decorator/get-user.decorator");
const create_staff_dto_1 = require("./dto/create.staff.dto");
const create_driver_dto_1 = require("./dto/create.driver.dto");
const jwt_guard_1 = require("./guard/jwt.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    createCustomer(dto) {
        return this.authService.CreateCustomer(dto);
    }
    createStaff(restaurantId, dto) {
        return this.authService.CreateStaff(restaurantId, dto);
    }
    createDriver(restaurantId, dto) {
        return this.authService.CreateDriver(restaurantId, dto);
    }
    signin(dto) {
        return this.authService.login(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiCreatedResponse)({ description: "Customer successfully created" }),
    (0, common_1.Post)('create-customer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createCustomer", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiCreatedResponse)({ description: "Staff successfully created" }),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('create-staff'),
    __param(0, (0, get_user_decorator_1.GetUser)('restaurantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_staff_dto_1.CreateStaffDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createStaff", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiCreatedResponse)({ description: "Driver successfully created" }),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('create-driver'),
    __param(0, (0, get_user_decorator_1.GetUser)('restaurantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_driver_dto_1.CreateDriverDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createDriver", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AuthDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('authentication'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map