-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('ADOPTADO', 'EN_TRANSITO', 'EN_ADOPCION');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'EN_ADOPCION';
