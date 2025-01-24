/*
  Warnings:

  - You are about to drop the column `isMdxEditor` on the `Blog` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Editor" AS ENUM ('RichEditor', 'MdxEditor');

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "isMdxEditor",
ADD COLUMN     "editor" "Editor" NOT NULL DEFAULT 'MdxEditor';
