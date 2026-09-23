-- Add the enum column in a data-safe sequence for existing requests.
ALTER TABLE `CollectionRequest`
  ADD COLUMN `request_type` ENUM('MIXED', 'RECYCLABLE') NULL;

UPDATE `CollectionRequest`
SET `request_type` = 'MIXED'
WHERE `request_type` IS NULL;

ALTER TABLE `CollectionRequest`
  MODIFY COLUMN `request_type` ENUM('MIXED', 'RECYCLABLE') NOT NULL;