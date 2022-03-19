/*
  Warnings:

  - You are about to drop the `sale_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sales` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sale_details" DROP CONSTRAINT "sale_details_product_id_fkey";

-- DropForeignKey
ALTER TABLE "sale_details" DROP CONSTRAINT "sale_details_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_user_id_fkey";

-- DropTable
DROP TABLE "sale_details";

-- DropTable
DROP TABLE "sales";

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_details" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
