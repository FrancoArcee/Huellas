/*
  Warnings:

  - Changed the type of `type` on the `ClinicalHistoryItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ClinicalHistoryType" AS ENUM ('VACUNACION', 'DESPARASITACION', 'CHEQUEO_PREVENTIVO', 'OTRO');

-- AlterTable
ALTER TABLE "ClinicalHistoryItem" DROP COLUMN "type",
ADD COLUMN     "type" "ClinicalHistoryType" NOT NULL;
