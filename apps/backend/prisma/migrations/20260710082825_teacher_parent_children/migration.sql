-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'TEACHER';

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_parentId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "objectif",
ADD COLUMN     "childrenCount" INTEGER,
ADD COLUMN     "classes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "objectifs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "schools" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

