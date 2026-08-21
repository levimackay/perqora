-- CreateEnum
CREATE TYPE "PricePeriod" AS ENUM ('ONE_TIME', 'MONTHLY', 'ANNUAL');

-- AlterTable
ALTER TABLE "benefits" ADD COLUMN     "pricePeriod" "PricePeriod";
