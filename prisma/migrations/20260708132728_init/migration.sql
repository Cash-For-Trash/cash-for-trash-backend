/*
  Warnings:

  - You are about to drop the `addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collection_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `garbage_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `garbages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_userId_fkey`;

-- DropForeignKey
ALTER TABLE `collection_requests` DROP FOREIGN KEY `collection_requests_userId_fkey`;

-- DropForeignKey
ALTER TABLE `collection_requests` DROP FOREIGN KEY `collection_requests_workerId_fkey`;

-- DropForeignKey
ALTER TABLE `garbages` DROP FOREIGN KEY `garbages_garbageTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `garbages` DROP FOREIGN KEY `garbages_requestId_fkey`;

-- DropForeignKey
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_workerId_fkey`;

-- DropTable
DROP TABLE `addresses`;

-- DropTable
DROP TABLE `collection_requests`;

-- DropTable
DROP TABLE `garbage_types`;

-- DropTable
DROP TABLE `garbages`;

-- DropTable
DROP TABLE `schedules`;

-- DropTable
DROP TABLE `users`;

-- DropTable
DROP TABLE `workers`;

-- CreateTable
CREATE TABLE `PointsTransaction` (
    `point_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL,
    `reason` VARCHAR(100) NOT NULL,
    `points_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PointsTransaction_user_id_idx`(`user_id`),
    PRIMARY KEY (`point_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Availability` (
    `availability_id` VARCHAR(191) NOT NULL,
    `location` VARCHAR(300) NOT NULL,
    `day_of_week` VARCHAR(15) NOT NULL,
    `from_time` DATETIME(3) NOT NULL,
    `to_time` DATETIME(3) NOT NULL,

    INDEX `Availability_day_of_week_idx`(`day_of_week`),
    PRIMARY KEY (`availability_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GarbageType` (
    `garbage_type_id` VARCHAR(191) NOT NULL,
    `garbage_type_name` VARCHAR(100) NOT NULL,
    `garbage_type_image` VARCHAR(512) NOT NULL,
    `price_per_kg` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`garbage_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestGarbage` (
    `request_garbage_id` VARCHAR(191) NOT NULL,
    `collection_request_id` VARCHAR(191) NOT NULL,
    `garbage_type_id` VARCHAR(191) NOT NULL,
    `actual_weight` DECIMAL(10, 2) NULL,
    `earned_points` INTEGER NULL,

    INDEX `RequestGarbage_collection_request_id_idx`(`collection_request_id`),
    INDEX `RequestGarbage_garbage_type_id_idx`(`garbage_type_id`),
    PRIMARY KEY (`request_garbage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CollectionRequest` (
    `collection_request_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `request_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quantity` DECIMAL(10, 2) NOT NULL,
    `collection_img` VARCHAR(512) NULL,
    `status` VARCHAR(40) NOT NULL,

    INDEX `CollectionRequest_user_id_request_date_idx`(`user_id`, `request_date`),
    INDEX `CollectionRequest_status_request_date_idx`(`status`, `request_date`),
    PRIMARY KEY (`collection_request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` VARCHAR(191) NOT NULL,
    `collection_request_id` VARCHAR(191) NOT NULL,
    `payment_method` VARCHAR(60) NOT NULL,
    `payment_status` VARCHAR(40) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `payment_amount` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `Payment_collection_request_id_key`(`collection_request_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `order_id` VARCHAR(191) NOT NULL,
    `payment_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `final_price` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` VARCHAR(30) NOT NULL,

    INDEX `Order_user_id_created_at_idx`(`user_id`, `created_at`),
    INDEX `Order_status_idx`(`status`),
    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `orderItem_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,

    INDEX `OrderItem_product_id_idx`(`product_id`),
    PRIMARY KEY (`orderItem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `product_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(300) NOT NULL,
    `stock_quantity` INTEGER NOT NULL,
    `image` VARCHAR(512) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Product_name_idx`(`name`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkerCollectionRequest` (
    `user_id` VARCHAR(191) NOT NULL,
    `collection_request_id` VARCHAR(191) NOT NULL,

    INDEX `WorkerCollectionRequest_collection_request_id_idx`(`collection_request_id`),
    PRIMARY KEY (`user_id`, `collection_request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkerAvailability` (
    `availability_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    INDEX `WorkerAvailability_user_id_idx`(`user_id`),
    PRIMARY KEY (`availability_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `notification_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(500) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Notification_user_id_is_read_idx`(`user_id`, `is_read`),
    INDEX `Notification_created_at_idx`(`created_at`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `mobile` VARCHAR(20) NULL,
    `national_id` VARCHAR(20) NULL,
    `image` VARCHAR(512) NULL,
    `role` VARCHAR(20) NOT NULL,
    `otp` VARCHAR(6) NULL,
    `otp_created_at` DATETIME(3) NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_national_id_key`(`national_id`),
    INDEX `User_role_is_active_idx`(`role`, `is_active`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `address_id` VARCHAR(191) NOT NULL,
    `building_num` INTEGER NOT NULL,
    `floor` VARCHAR(191) NULL,
    `location` VARCHAR(300) NOT NULL,
    `latitude` DECIMAL(10, 7) NOT NULL,
    `longitude` DECIMAL(10, 7) NOT NULL,
    `additional_note` VARCHAR(500) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Address_user_id_idx`(`user_id`),
    PRIMARY KEY (`address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `user_id` VARCHAR(191) NOT NULL,
    `points` DECIMAL(10, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Worker` (
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reward` (
    `reward_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `required_points` DECIMAL(10, 2) NOT NULL,
    `image` VARCHAR(512) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`reward_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RewardRedemption` (
    `redemption_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `reward_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `points_spent` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL,

    INDEX `RewardRedemption_user_id_status_idx`(`user_id`, `status`),
    PRIMARY KEY (`redemption_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PointsTransaction` ADD CONSTRAINT `PointsTransaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestGarbage` ADD CONSTRAINT `RequestGarbage_collection_request_id_fkey` FOREIGN KEY (`collection_request_id`) REFERENCES `CollectionRequest`(`collection_request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestGarbage` ADD CONSTRAINT `RequestGarbage_garbage_type_id_fkey` FOREIGN KEY (`garbage_type_id`) REFERENCES `GarbageType`(`garbage_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollectionRequest` ADD CONSTRAINT `CollectionRequest_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_collection_request_id_fkey` FOREIGN KEY (`collection_request_id`) REFERENCES `CollectionRequest`(`collection_request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkerCollectionRequest` ADD CONSTRAINT `WorkerCollectionRequest_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Worker`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkerCollectionRequest` ADD CONSTRAINT `WorkerCollectionRequest_collection_request_id_fkey` FOREIGN KEY (`collection_request_id`) REFERENCES `CollectionRequest`(`collection_request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkerAvailability` ADD CONSTRAINT `WorkerAvailability_availability_id_fkey` FOREIGN KEY (`availability_id`) REFERENCES `Availability`(`availability_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkerAvailability` ADD CONSTRAINT `WorkerAvailability_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Worker`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Worker` ADD CONSTRAINT `Worker_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RewardRedemption` ADD CONSTRAINT `RewardRedemption_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Customer`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RewardRedemption` ADD CONSTRAINT `RewardRedemption_reward_id_fkey` FOREIGN KEY (`reward_id`) REFERENCES `Reward`(`reward_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
