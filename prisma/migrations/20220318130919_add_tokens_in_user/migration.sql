/*
  Warnings:

  - You are about to drop the column `uuid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "uuid",
ADD COLUMN     "token" TEXT;

-- DropTable
DROP TABLE "tokens";
