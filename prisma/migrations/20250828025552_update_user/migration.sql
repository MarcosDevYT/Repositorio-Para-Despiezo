-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bussinesCategory" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "description" TEXT;
