/*
  Warnings:

  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `offerPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "offerPrice" SET DATA TYPE INTEGER;
