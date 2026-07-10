/*
  Warnings:

  - You are about to alter the column `day_of_week` on the `Availability` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `CollectionRequest` table. The data in that column could be lost. The data in that column will be cast from `VarChar(40)` to `Enum(EnumId(1))`.
  - You are about to alter the column `status` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `Enum(EnumId(3))`.
  - You are about to alter the column `payment_status` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(40)` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `RewardRedemption` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(5))`.
  - You are about to drop the column `national_id` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(4))`.
  - A unique constraint covering the columns `[national_id]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `national_id` to the `Worker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_national_id_key` ON `User`;

-- AlterTable
ALTER TABLE `Availability` MODIFY `day_of_week` ENUM('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY') NOT NULL;

-- AlterTable
ALTER TABLE `CollectionRequest` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'ON_THE_WAY', 'COLLECTED', 'CANCELLED') NOT NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `payment_status` ENUM('PENDING', 'PAID', 'FAILED') NOT NULL;

-- AlterTable
ALTER TABLE `RewardRedemption` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'DELIVERED') NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `national_id`,
    MODIFY `role` ENUM('CUSTOMER', 'WORKER', 'ADMIN') NOT NULL;

-- AlterTable
ALTER TABLE `Worker` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `national_id` VARCHAR(14) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Worker_national_id_key` ON `Worker`(`national_id`);
