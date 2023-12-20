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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const userType_enum_1 = require("./enums/userType.enum");
const gateway_service_1 = require("../../gateway/gateway.service");
const gateway_constants_1 = require("../../gateway/dto/gateway.constants");
let UserService = class UserService {
    constructor(prisma, socket) {
        this.prisma = prisma;
        this.socket = socket;
    }
    async updateUser(userId, dto) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto,
            },
        });
        delete user.hash;
        return user;
    }
    async updateDriverUser(userId, dto) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto,
            },
        });
        delete user.hash;
        this.socket.emitToClient(gateway_constants_1.UserManagementEvents.get_all_drivers_event);
        return user;
    }
    async updateStaffUser(userId, dto) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto,
            },
        });
        delete user.hash;
        this.socket.emitToClient(gateway_constants_1.UserManagementEvents.get_all_staff_event);
        return user;
    }
    async getUserById(userId) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: parseInt(userId)
            },
        });
        delete user.hash;
        return user;
    }
    async getUserByRestaurantId(restaurantId) {
        const user = await this.prisma.user.findMany({
            where: {
                restaurantId: parseInt(restaurantId)
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        });
        return user.map(({ hash, ...newUsers }) => newUsers);
    }
    async getUserByStaffId(staffId) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: parseInt(staffId)
            }
        });
        delete user.hash;
        return user;
    }
    async getUserByDriverId(driverId) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: parseInt(driverId)
            }
        });
        delete user.hash;
        return user;
    }
    async getRestaurantStaff(restaurantId) {
        const user = await this.prisma.user.findMany({
            where: {
                restaurantId: parseInt(restaurantId),
                userTypeId: userType_enum_1.UserType.Staff
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        });
        return user.map(({ hash, ...newUsers }) => newUsers);
    }
    async getRestaurantDrivers(restaurantId) {
        const user = await this.prisma.user.findMany({
            where: {
                restaurantId: parseInt(restaurantId),
                userTypeId: userType_enum_1.UserType.Driver
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        });
        return user.map(({ hash, ...newUsers }) => newUsers);
    }
    async getRestaurantCustomers(restaurantId) {
        const user = await this.prisma.user.findMany({
            where: {
                restaurantId: parseInt(restaurantId),
                userTypeId: userType_enum_1.UserType.Customer
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        });
        return user.map(({ hash, ...newUsers }) => newUsers);
    }
    async getAllUsers() {
        const users = (await this.prisma.user.findMany({
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        }));
        return users.map(({ hash, ...newUsers }) => newUsers);
    }
    async getSuperUser() {
        const user = {
            admin: 'admin'
        };
        return user;
    }
    async deleteById(dto) {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    id: {
                        in: dto.id.map(id => parseInt(id)),
                    },
                },
            });
            if (users.length > 0) {
                const userType = users[0].userTypeId;
                const result = await this.prisma.user.deleteMany({
                    where: {
                        id: {
                            in: users.map(user => user.id)
                        }
                    },
                });
                if (userType == userType_enum_1.UserType.Driver) {
                    this.socket.emitToClient(gateway_constants_1.UserManagementEvents.get_all_drivers_event);
                }
                else if (userType == userType_enum_1.UserType.Staff) {
                    this.socket.emitToClient(gateway_constants_1.UserManagementEvents.get_all_staff_event);
                }
                else if (userType == userType_enum_1.UserType.Customer) {
                    this.socket.emitToClient(gateway_constants_1.UserManagementEvents.get_all_customers_event);
                }
            }
            return { status: "Successful", message: "User successfully deleted" };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, gateway_service_1.GatewayService])
], UserService);
//# sourceMappingURL=user.service.js.map