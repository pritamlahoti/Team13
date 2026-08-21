CREATE TABLE "mentor_assignments" (
    "id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_assignments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "mentor_assignments_student_id_key" ON "mentor_assignments"("student_id");
CREATE UNIQUE INDEX "mentor_assignments_mentor_id_student_id_key" ON "mentor_assignments"("mentor_id", "student_id");

ALTER TABLE "mentor_assignments" ADD CONSTRAINT "mentor_assignments_mentor_id_fkey"
  FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mentor_assignments" ADD CONSTRAINT "mentor_assignments_student_id_fkey"
  FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;