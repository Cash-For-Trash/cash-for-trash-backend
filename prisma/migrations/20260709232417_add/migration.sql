-- AlterTable
ALTER TABLE `User` ADD COLUMN `reset_password_otp` VARCHAR(6) NULL,
    ADD COLUMN `reset_password_otp_expires_at` DATETIME(3) NULL;
