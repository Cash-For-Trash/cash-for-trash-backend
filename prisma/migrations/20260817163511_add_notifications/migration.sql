/*
  Warnings:

  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `related_id` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('REQUEST_CREATED', 'REQUEST_NEEDS_RESCHEDULE', 'REQUEST_ACCEPTED', 'REQUEST_ON_THE_WAY', 'REQUEST_COLLECTED', 'REQUEST_CANCELLED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'POINTS_EARNED', 'REWARD_REQUESTED', 'REWARD_APPROVED', 'REWARD_REJECTED', 'REWARD_DELIVERED', 'SYSTEM') NOT NULL;

-- CreateTable
CREATE TABLE `UserDevice` (
    `device_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `fcm_token` VARCHAR(191) NOT NULL,
    `device_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `UserDevice_user_id_idx`(`user_id`),
    PRIMARY KEY (`device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserDevice` ADD CONSTRAINT `UserDevice_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
