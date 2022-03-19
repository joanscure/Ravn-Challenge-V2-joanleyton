/*
  Warnings:

  - You are about to drop the column `code` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "description" DROP NOT NULL;
