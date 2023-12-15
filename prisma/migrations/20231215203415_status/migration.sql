/*
  Warnings:

  - Added the required column `deleted` to the `availabilitySchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `availabilitySchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `availabilitySchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deleted` to the `bookmarks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `bookmarks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deleted` to the `menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deleted` to the `menuCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `menuCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `menuCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deleted` to the `menuSubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `menuSubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `menuSubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "availabilitySchedule" ADD COLUMN     "deleted" BOOLEAN NOT NULL,
ADD COLUMN     "restaurantId" INTEGER NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "deleted" BOOLEAN NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "courierType" ADD COLUMN     "deleted" BOOLEAN,
ADD COLUMN     "status" BOOLEAN;

-- AlterTable
ALTER TABLE "menu" ADD COLUMN     "deleted" BOOLEAN NOT NULL,
ADD COLUMN     "restaurantId" INTEGER NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "menuCategory" ADD COLUMN     "deleted" BOOLEAN NOT NULL,
ADD COLUMN     "restaurantId" INTEGER NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "menuSubCategory" ADD COLUMN     "deleted" BOOLEAN NOT NULL,
ADD COLUMN     "restaurantId" INTEGER NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "restaurant" ADD COLUMN     "deleted" BOOLEAN,
ADD COLUMN     "status" BOOLEAN;

-- AlterTable
ALTER TABLE "userType" ADD COLUMN     "deleted" BOOLEAN,
ADD COLUMN     "status" BOOLEAN;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted" BOOLEAN,
ADD COLUMN     "status" BOOLEAN;

-- AddForeignKey
ALTER TABLE "menuCategory" ADD CONSTRAINT "menuCategory_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menuSubCategory" ADD CONSTRAINT "menuSubCategory_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availabilitySchedule" ADD CONSTRAINT "availabilitySchedule_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
