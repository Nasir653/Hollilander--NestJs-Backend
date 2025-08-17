-- CreateEnum
CREATE TYPE "StaffRequestStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'DELETED', 'PENDING');

-- CreateTable
CREATE TABLE "staff_request" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "staff_id" TEXT NOT NULL,
    "accept_reject_id" TEXT NOT NULL,
    "status" "StaffRequestStatus" NOT NULL DEFAULT 'PENDING',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "staff_request" ADD CONSTRAINT "staff_request_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_request" ADD CONSTRAINT "staff_request_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_request" ADD CONSTRAINT "staff_request_accept_reject_id_fkey" FOREIGN KEY ("accept_reject_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
