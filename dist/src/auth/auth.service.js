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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const library_1 = require("@prisma/client/runtime/library");
const restaurant_enum_1 = require("../restaurant/enums/restaurant.enum");
const userType_enum_1 = require("../restaurant/user/enums/userType.enum");
const courierType_enum_1 = require("../restaurant/user/enums/courierType.enum");
const gateway_service_1 = require("../gateway/gateway.service");
const dto_1 = require("../gateway/dto");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwt, config, socket) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.socket = socket;
    }
    async CreateCustomer(dto) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    hash,
                    phoneNumber: dto.phoneNumber,
                    address: dto.address,
                    restaurantId: restaurant_enum_1.Restaurant.Default,
                    userTypeId: userType_enum_1.UserType.Customer,
                    courierTypeId: courierType_enum_1.CourierType.Default
                },
            });
            this.socket.emitToClient(dto_1.UserManagementEvents.get_all_customers_event);
            return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
        }
        catch (error) {
            if (error instanceof
                library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }
    async CreateStaff(restaurantId, dto) {
        const defaultPassword = "Password123";
        const hash = await argon.hash(defaultPassword);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    hash,
                    phoneNumber: dto.phoneNumber,
                    address: dto.address,
                    restaurantId: parseInt(restaurantId),
                    userTypeId: userType_enum_1.UserType.Staff,
                    courierTypeId: courierType_enum_1.CourierType.Default
                },
            });
            this.socket.emitToClient(dto_1.UserManagementEvents.get_all_staff_event);
            return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Email already exist');
                }
            }
            throw error;
        }
    }
    async CreateDriver(restaurantId, dto) {
        const defaultPassword = "Password123";
        const hash = await argon.hash(defaultPassword);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    hash,
                    phoneNumber: dto.phoneNumber,
                    address: dto.address,
                    restaurantId: parseInt(restaurantId),
                    userTypeId: userType_enum_1.UserType.Driver,
                    courierTypeId: parseInt(dto.courierType)
                },
            });
            this.socket.emitToClient(dto_1.UserManagementEvents.get_all_drivers_event);
            return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Email already exist');
                }
            }
            throw error;
        }
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('Invalid Credentials');
        const pwMatches = await argon.verify(user.hash, dto.password);
        if (!pwMatches)
            throw new common_1.ForbiddenException('Invalid Credentials');
        return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
    }
    async signToken(userId, email, userType, restaurantId) {
        const payload = {
            sub: userId,
            email,
            userType,
            restaurantId
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '60m',
            secret: secret,
            jwtid: ''
        });
        return {
            access_token: token,
        };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('Invalid Email');
        const tokenResult = await this.GenerateToken();
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                passwordResetToken: tokenResult.hashedToken,
            },
        });
        return this.signToken(user.id, user.email, user.userTypeId, user.restaurantId);
    }
    async GenerateToken() {
        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = await argon.hash(token);
        return { token, hashedToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        gateway_service_1.GatewayService])
], AuthService);
//# sourceMappingURL=auth.service.js.map