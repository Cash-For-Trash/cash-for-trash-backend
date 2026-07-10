/*
  Warnings:

  - The values [CUSTOMER,WORKER,ADMIN] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('customer', 'worker', 'admin') NOT NULL;
