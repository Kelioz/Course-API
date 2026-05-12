/*
  Warnings:

  - You are about to drop the column `isComplete` on the `Step` table. All the data in the column will be lost.
  - Added the required column `title` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('InProgress', 'Completed', 'Dropped');

-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('Text', 'Video', 'Quiz', 'Task');

-- AlterTable
ALTER TABLE "Step" DROP COLUMN "isComplete",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "StepType" NOT NULL DEFAULT 'Text';

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" UUID NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'InProgress',

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedStep" (
    "id" UUID NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enrollment_id" UUID NOT NULL,
    "step_id" UUID NOT NULL,

    CONSTRAINT "CompletedStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_user_id_course_id_key" ON "Enrollment"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompletedStep_enrollment_id_step_id_key" ON "CompletedStep"("enrollment_id", "step_id");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedStep" ADD CONSTRAINT "CompletedStep_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedStep" ADD CONSTRAINT "CompletedStep_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "Step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
