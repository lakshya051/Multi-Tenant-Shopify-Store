/*
  Warnings:

  - A unique constraint covering the columns `[checkoutId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "checkoutId" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_checkoutId_key" ON "Order"("checkoutId");
