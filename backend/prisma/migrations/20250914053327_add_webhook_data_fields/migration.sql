-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "orderCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "name" TEXT,
ADD COLUMN     "vendor" TEXT;
