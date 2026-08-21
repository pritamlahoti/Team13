-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'mentor';

-- CreateTable
CREATE TABLE "mentor_assignments" (
    "id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mentor_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentor_assignments_mentor_id_student_id_key"
    ON "mentor_assignments"("mentor_id", "student_id");

-- AddForeignKey
ALTER TABLE "mentor_assignments"
    ADD CONSTRAINT "mentor_assignments_mentor_id_fkey"
    FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_assignments"
    ADD CONSTRAINT "mentor_assignments_student_id_fkey"
    FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
