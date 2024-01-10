// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

// initialize Prisma Client
const prisma = new PrismaClient();
async function main() {
    const courierTypes = [{ id: 1, name: "Default" }, { id: 2, name: "Car" }, { id: 3, name: "Bycicle" }];
    const userTypes = [{ id: 1, name: "Staff" }, { id: 2, name: "Customer" }, { id: 3, name: "Driver" }, { id: 4, name: "Client" }];
    const defaultPassword = "Password123"
    const hash = await argon.hash(defaultPassword);
    const restaurant = await prisma.restaurant.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Default Restaurant',
            clientId: 1
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

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
