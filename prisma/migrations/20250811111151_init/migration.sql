/*
  Warnings:

  - You are about to drop the column `visa_type` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `nurse_departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('APPROVED', 'REJECTED', 'DELETED', 'PENDING');

-- DropForeignKey
ALTER TABLE "user_documents" DROP CONSTRAINT "user_documents_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "visa_type",
ADD COLUMN     "visa_type_id" INTEGER;

-- DropTable
DROP TABLE "nurse_departments";

-- DropTable
DROP TABLE "user_documents";

-- CreateTable
CREATE TABLE "staff_documents" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "doc_id" INTEGER NOT NULL,
    "doc_url" TEXT,
    "doc_expire" TIMESTAMP(3),
    "docStatus" "DocStatus" NOT NULL DEFAULT 'PENDING',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "all_documents" (
    "id" SERIAL NOT NULL,
    "document_name" VARCHAR(350) NOT NULL,
    "document_details" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "all_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_departments" (
    "id" SERIAL NOT NULL,
    "department_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_departments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_visa_type_id_fkey" FOREIGN KEY ("visa_type_id") REFERENCES "visa_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_documents" ADD CONSTRAINT "staff_documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_documents" ADD CONSTRAINT "staff_documents_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "all_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
