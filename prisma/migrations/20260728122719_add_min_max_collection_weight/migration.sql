/*
  Warnings:

  - Added the required column `maximum_collection_weight` to the `PricingSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimum_collection_weight` to the `PricingSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PricingSettings` ADD COLUMN `maximum_collection_weight` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `minimum_collection_weight` DECIMAL(10, 2) NOT NULL;
