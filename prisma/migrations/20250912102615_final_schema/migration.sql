-- DropForeignKey
ALTER TABLE "public"."Customer" DROP CONSTRAINT "Customer_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_tenantId_fkey";

-- CreateTable
CREATE TABLE "public"."LineItem" (
    "id" BIGINT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" BIGINT NOT NULL,
    "productId" BIGINT,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LineItem_id_tenantId_key" ON "public"."LineItem"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineItem" ADD CONSTRAINT "LineItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineItem" ADD CONSTRAINT "LineItem_orderId_tenantId_fkey" FOREIGN KEY ("orderId", "tenantId") REFERENCES "public"."Order"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineItem" ADD CONSTRAINT "LineItem_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES "public"."Product"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
