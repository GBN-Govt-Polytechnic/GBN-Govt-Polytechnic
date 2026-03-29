-- CreateEnum
CREATE TYPE "public_document_category" AS ENUM ('APPROVAL', 'MANDATORY_DISCLOSURE', 'FEE_STRUCTURE', 'RTI', 'ANNUAL_REPORT', 'COMMITTEE', 'GOVT_ORDER', 'OTHER');

-- CreateTable
CREATE TABLE "public_documents" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "category" "public_document_category" NOT NULL,
    "year" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "public_documents_category_idx" ON "public_documents"("category");

-- CreateIndex
CREATE INDEX "public_documents_is_active_idx" ON "public_documents"("is_active");
