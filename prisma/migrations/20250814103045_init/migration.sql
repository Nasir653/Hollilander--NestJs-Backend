-- CreateTable
CREATE TABLE "staff_availability" (
    "id" SERIAL NOT NULL,
    "staff_id" TEXT NOT NULL,
    "start_week_date" TIMESTAMP(3) NOT NULL,
    "end_week_date" TIMESTAMP(3) NOT NULL,
    "days_availability" JSONB NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "staff_availability" ADD CONSTRAINT "staff_availability_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
