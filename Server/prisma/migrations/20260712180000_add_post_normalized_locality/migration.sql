-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "provinceId" TEXT,
ADD COLUMN     "provinceName" TEXT,
ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "departmentName" TEXT,
ADD COLUMN     "municipalityId" TEXT,
ADD COLUMN     "municipalityName" TEXT,
ADD COLUMN     "localityId" TEXT,
ADD COLUMN     "localityName" TEXT;

-- CreateIndex
CREATE INDEX "Post_localityId_idx" ON "Post"("localityId");

-- CreateIndex
CREATE INDEX "Post_municipalityId_idx" ON "Post"("municipalityId");

-- CreateIndex
CREATE INDEX "Post_departmentId_idx" ON "Post"("departmentId");
