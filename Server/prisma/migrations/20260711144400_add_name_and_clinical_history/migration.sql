-- CreateTable
CREATE TABLE "ClinicalHistoryItem" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(3) NOT NULL,
    "veterinary" TEXT NOT NULL,
    "veterinarian" TEXT NOT NULL,
    "comprobante" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalHistoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClinicalHistoryItem_postId_idx" ON "ClinicalHistoryItem"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "User_contact_contactType_key" ON "User"("contact", "contactType");

-- AddForeignKey
ALTER TABLE "ClinicalHistoryItem" ADD CONSTRAINT "ClinicalHistoryItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
