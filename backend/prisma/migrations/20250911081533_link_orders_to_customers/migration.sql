-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "customerId" BIGINT;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_tenantId_fkey" FOREIGN KEY ("customerId", "tenantId") REFERENCES "public"."Customer"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
