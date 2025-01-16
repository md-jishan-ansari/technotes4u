/*
  Warnings:

  - The `iconImage` column on the `Blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "iconImage",
ADD COLUMN     "iconImage" JSONB;
