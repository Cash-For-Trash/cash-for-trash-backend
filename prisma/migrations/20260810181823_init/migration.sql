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
    `area_id` VARCHAR(191) NOT NULL,
    `day_of_week` ENUM('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY') NOT NULL,
    `from_time` TIME NOT NULL,
    `to_time` TIME NOT NULL,

    INDEX `Availability_area_id_day_of_week_from_time_idx`(`area_id`, `day_of_week`, `from_time`),
    UNIQUE INDEX `Availability_area_id_day_of_week_from_time_to_time_key`(`area_id`, `day_of_week`, `from_time`, `to_time`),
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
    `expected_weight` DECIMAL(10, 2) NOT NULL,
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
    `address_id` VARCHAR(191) NOT NULL,
    `request_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quantity` DECIMAL(10, 2) NOT NULL,
    `collection_img` VARCHAR(512) NULL,
    `status` ENUM('PENDING', 'NEEDS_RESCHEDULE', 'ACCEPTED', 'ON_THE_WAY', 'COLLECTED', 'CANCELLED') NOT NULL,
    `payment_method` ENUM('MONTHLY', 'CASH', 'WALLET', 'CARD') NOT NULL,
    `scheduled_day` ENUM('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY') NOT NULL,
    `scheduled_from_time` TIME NOT NULL,
    `scheduled_to_time` TIME NOT NULL,
    `service_price` DECIMAL(10, 2) NOT NULL,
    `worker_share` DECIMAL(10, 2) NOT NULL,
    `availability_id` VARCHAR(191) NOT NULL,

    INDEX `CollectionRequest_user_id_request_date_idx`(`user_id`, `request_date`),
    INDEX `CollectionRequest_status_request_date_idx`(`status`, `request_date`),
    INDEX `CollectionRequest_address_id_idx`(`address_id`),
    INDEX `CollectionRequest_scheduled_day_idx`(`scheduled_day`),
    INDEX `CollectionRequest_address_id_scheduled_day_idx`(`address_id`, `scheduled_day`),
    PRIMARY KEY (`collection_request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` VARCHAR(191) NOT NULL,
    `collection_request_id` VARCHAR(191) NOT NULL,
    `payment_method` ENUM('MONTHLY', 'CASH', 'WALLET', 'CARD') NOT NULL,
    `payment_status` ENUM('PENDING', 'PAID', 'FAILED') NOT NULL,
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
    `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL,

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
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_current` BOOLEAN NOT NULL DEFAULT true,

    INDEX `WorkerCollectionRequest_collection_request_id_idx`(`collection_request_id`),
    INDEX `WorkerCollectionRequest_user_id_is_current_idx`(`user_id`, `is_current`),
    PRIMARY KEY (`user_id`, `collection_request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkerAvailability` (
    `availability_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    INDEX `WorkerAvailability_user_id_idx`(`user_id`),
    INDEX `WorkerAvailability_availability_id_idx`(`availability_id`),
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
    `image` VARCHAR(512) NULL,
    `role` ENUM('customer', 'worker', 'admin') NOT NULL,
    `otp` VARCHAR(6) NULL,
    `otp_expires_at` DATETIME(3) NULL,
    `reset_password_otp` VARCHAR(6) NULL,
    `reset_password_otp_expires_at` DATETIME(3) NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
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
    `national_id` VARCHAR(14) NULL,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `approved_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Worker_national_id_key`(`national_id`),
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
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'DELIVERED') NOT NULL,

    INDEX `RewardRedemption_user_id_status_idx`(`user_id`, `status`),
    PRIMARY KEY (`redemption_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `service_price` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Area_name_key`(`name`),
    INDEX `Area_name_idx`(`name`),
    INDEX `Area_is_active_idx`(`is_active`),
    PRIMARY KEY (`area_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `minimum_collection_weight` DECIMAL(10, 2) NOT NULL,
    `maximum_collection_weight` DECIMAL(10, 2) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PointsTransaction` ADD CONSTRAINT `PointsTransaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Availability` ADD CONSTRAINT `Availability_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `Area`(`area_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestGarbage` ADD CONSTRAINT `RequestGarbage_collection_request_id_fkey` FOREIGN KEY (`collection_request_id`) REFERENCES `CollectionRequest`(`collection_request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestGarbage` ADD CONSTRAINT `RequestGarbage_garbage_type_id_fkey` FOREIGN KEY (`garbage_type_id`) REFERENCES `GarbageType`(`garbage_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollectionRequest` ADD CONSTRAINT `CollectionRequest_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollectionRequest` ADD CONSTRAINT `CollectionRequest_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`address_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollectionRequest` ADD CONSTRAINT `CollectionRequest_availability_id_fkey` FOREIGN KEY (`availability_id`) REFERENCES `Availability`(`availability_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Customer`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
