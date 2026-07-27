/*
  Warnings:

  - A unique constraint covering the columns `[area_id,day_of_week,from_time,to_time]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CollectionRequest` MODIFY `status` ENUM('PENDING', 'NEEDS_RESCHEDULE', 'ACCEPTED', 'ON_THE_WAY', 'COLLECTED', 'CANCELLED') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Availability_area_id_day_of_week_from_time_to_time_key` ON `Availability`(`area_id`, `day_of_week`, `from_time`, `to_time`);

-- AddForeignKey
ALTER TABLE `Availability` ADD CONSTRAINT `Availability_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `Area`(`area_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
