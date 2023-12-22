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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    const courierTypes = [{ id: 1, name: "Default" }, { id: 2, name: "Car" }, { id: 3, name: "Bycicle" }];
    const userTypes = [{ id: 1, name: "Staff" }, { id: 2, name: "Customer" }, { id: 3, name: "Driver" }];
    const defaultPassword = "Password123";
    const hash = await argon.hash(defaultPassword);
    const restaurant = await prisma.restaurant.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Default Restaurant'
        },
    });
    for (let i = 0; i < courierTypes.length; i++) {
        await prisma.courierType.upsert({
            where: { id: courierTypes[i].id },
            update: {},
            create: {
                Name: courierTypes[i].name
            },
        });
    }
    for (let i = 0; i < userTypes.length; i++) {
        await prisma.userType.upsert({
            where: { id: userTypes[i].id },
            update: {},
            create: {
                Name: userTypes[i].name
            },
        });
    }
    await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            email: 'cafayadmin@gmail.com',
            firstName: 'cafay',
            lastName: 'admin',
            hash,
            phoneNumber: '08187019424',
            address: 'Ikeja Lagos Nigeria',
            restaurantId: restaurant.id,
            userTypeId: userTypes[0].id,
            courierTypeId: courierTypes[0].id
        },
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map