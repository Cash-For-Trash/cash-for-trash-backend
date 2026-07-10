-- AlterTable
ALTER TABLE `Worker` ADD COLUMN `approved_at` DATETIME(3) NULL,
    ADD COLUMN `is_approved` BOOLEAN NOT NULL DEFAULT false;
