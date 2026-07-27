/*
  Warnings:

  - You are about to alter the column `payment_method` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(60)` to `Enum(EnumId(4))`.
  - Added the required column `payment_method` to the `CollectionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled_day` to the `CollectionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled_from_time` to the `CollectionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled_to_time` to the `CollectionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_price` to the `CollectionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worker_share` to the `CollectionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Area` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `service_price` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `CollectionRequest` ADD COLUMN `payment_method` ENUM('MONTHLY', 'CASH') NOT NULL,
    ADD COLUMN `scheduled_day` ENUM('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY') NOT NULL,
    ADD COLUMN `scheduled_from_time` TIME NOT NULL,
    ADD COLUMN `scheduled_to_time` TIME NOT NULL,
    ADD COLUMN `service_price` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `worker_share` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `payment_method` ENUM('MONTHLY', 'CASH') NOT NULL;

-- AlterTable
ALTER TABLE `WorkerCollectionRequest` ADD COLUMN `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_current` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `Subscription` (
    `subscription_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Subscription_user_id_is_active_idx`(`user_id`, `is_active`),
    PRIMARY KEY (`subscription_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PricingSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `worker_percentage` DECIMAL(5, 2) NOT NULL,
    `monthly_subscription_price` DECIMAL(10, 2) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Area_is_active_idx` ON `Area`(`is_active`);

-- CreateIndex
CREATE INDEX `CollectionRequest_scheduled_day_idx` ON `CollectionRequest`(`scheduled_day`);

-- CreateIndex
CREATE INDEX `CollectionRequest_address_id_scheduled_day_idx` ON `CollectionRequest`(`address_id`, `scheduled_day`);

-- CreateIndex
CREATE INDEX `WorkerCollectionRequest_user_id_is_current_idx` ON `WorkerCollectionRequest`(`user_id`, `is_current`);

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Customer`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
