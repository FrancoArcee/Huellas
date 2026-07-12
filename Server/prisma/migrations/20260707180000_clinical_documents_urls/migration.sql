-- AlterTable
ALTER TABLE "ClinicalHistoryEntry" ADD COLUMN "documentsUrl" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing data (if any)
UPDATE "ClinicalHistoryEntry"
SET "documentsUrl" = ARRAY["documentUrl"]
WHERE "documentUrl" IS NOT NULL;

-- Drop old column
ALTER TABLE "ClinicalHistoryEntry" DROP COLUMN "documentUrl";
