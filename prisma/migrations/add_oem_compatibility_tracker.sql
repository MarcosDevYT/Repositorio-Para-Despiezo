-- CreateTable
CREATE TABLE "OemCompatibilityTracker" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "oem" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "compatibilityCount" INTEGER NOT NULL DEFAULT 0,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OemCompatibilityTracker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OemCompatibilityTracker_productId_key" ON "OemCompatibilityTracker"("productId");

-- CreateIndex
CREATE INDEX "OemCompatibilityTracker_oem_idx" ON "OemCompatibilityTracker"("oem");

-- CreateIndex
CREATE INDEX "OemCompatibilityTracker_status_idx" ON "OemCompatibilityTracker"("status");

-- CreateIndex
CREATE INDEX "OemCompatibilityTracker_productId_idx" ON "OemCompatibilityTracker"("productId");

-- AddForeignKey
ALTER TABLE "OemCompatibilityTracker" ADD CONSTRAINT "OemCompatibilityTracker_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
