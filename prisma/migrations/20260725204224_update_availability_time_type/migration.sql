-- DropForeignKey
ALTER TABLE `Availability` DROP FOREIGN KEY `Availability_area_id_fkey`;

-- DropIndex
DROP INDEX `Availability_area_id_day_of_week_idx` ON `Availability`;

-- AlterTable
ALTER TABLE `Availability` MODIFY `from_time` TIME NOT NULL,
    MODIFY `to_time` TIME NOT NULL;

-- CreateIndex
CREATE INDEX `Availability_area_id_day_of_week_from_time_idx` ON `Availability`(`area_id`, `day_of_week`, `from_time`);

-- CreateIndex
CREATE INDEX `WorkerAvailability_availability_id_idx` ON `WorkerAvailability`(`availability_id`);

-- RenameIndex
ALTER TABLE `CollectionRequest` RENAME INDEX `CollectionRequest_address_id_fkey` TO `CollectionRequest_address_id_idx`;
