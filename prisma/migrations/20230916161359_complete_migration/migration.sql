-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "activationCode" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refreshToken" TEXT;
