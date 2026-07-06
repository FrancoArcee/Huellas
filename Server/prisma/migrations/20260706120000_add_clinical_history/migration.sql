-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('VACUNACION', 'DESPARASITACION', 'CONSULTA_GENERAL', 'CIRUGIA', 'DIAGNOSTICO');

-- CreateTable
CREATE TABLE "ClinicalHistory" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalHistoryEntry" (
    "id" TEXT NOT NULL,
    "clinicalHistoryId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "eventType" "EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalHistoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalHistory_postId_key" ON "ClinicalHistory"("postId");

-- CreateIndex
CREATE INDEX "ClinicalHistory_postId_idx" ON "ClinicalHistory"("postId");

-- CreateIndex
CREATE INDEX "ClinicalHistoryEntry_clinicalHistoryId_idx" ON "ClinicalHistoryEntry"("clinicalHistoryId");

-- CreateIndex
CREATE UNIQUE INDEX "User_contact_contactType_key" ON "User"("contact", "contactType");

-- AddForeignKey
ALTER TABLE "ClinicalHistory" ADD CONSTRAINT "ClinicalHistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalHistoryEntry" ADD CONSTRAINT "ClinicalHistoryEntry_clinicalHistoryId_fkey" FOREIGN KEY ("clinicalHistoryId") REFERENCES "ClinicalHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
