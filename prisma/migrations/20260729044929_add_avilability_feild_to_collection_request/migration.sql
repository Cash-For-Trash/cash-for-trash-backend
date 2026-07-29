/*
  Warnings:

  - Added the required column `availability_id` to the `CollectionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expected_weight` to the `RequestGarbage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CollectionRequest` ADD COLUMN `availability_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `RequestGarbage` ADD COLUMN `expected_weight` DECIMAL(10, 2) NOT NULL;

-- AddForeignKey
ALTER TABLE `CollectionRequest` ADD CONSTRAINT `CollectionRequest_availability_id_fkey` FOREIGN KEY (`availability_id`) REFERENCES `Availability`(`availability_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
