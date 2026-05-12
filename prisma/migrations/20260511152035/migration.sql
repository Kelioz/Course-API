/*
  Warnings:

  - You are about to drop the column `module_id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `Step` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `module_id` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_module_id_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Step" DROP CONSTRAINT "Step_course_id_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "module_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "user_id",
ADD COLUMN     "course_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Step" DROP COLUMN "course_id",
ADD COLUMN     "module_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
