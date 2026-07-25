/*
  Warnings:

  - You are about to drop the column `location` on the `Availability` table. All the data in the column will be lost.
  - Added the required column `area_id` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `CollectionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Availability_day_of_week_idx` ON `Availability`;

-- AlterTable
ALTER TABLE `Availability` DROP COLUMN `location`,
    ADD COLUMN `area_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `CollectionRequest` ADD COLUMN `address_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Area` (
    `area_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `north_lat` DECIMAL(10, 7) NOT NULL,
    `south_lat` DECIMAL(10, 7) NOT NULL,
    `east_lng` DECIMAL(10, 7) NOT NULL,
    `west_lng` DECIMAL(10, 7) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Area_name_key`(`name`),
    INDEX `Area_name_idx`(`name`),
    PRIMARY KEY (`area_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Availability_area_id_day_of_week_idx` ON `Availability`(`area_id`, `day_of_week`);

-- AddForeignKey
ALTER TABLE `Availability` ADD CONSTRAINT `Availability_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `Area`(`area_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollectionRequest` ADD CONSTRAINT `CollectionRequest_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`address_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
