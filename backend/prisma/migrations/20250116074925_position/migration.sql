/*
  Warnings:

  - You are about to drop the column `position` on the `Blog` table. All the data in the column will be lost.
  - You are about to alter the column `sortOrder` on the `Blog` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "position",
ALTER COLUMN "sortOrder" SET DATA TYPE INTEGER;
