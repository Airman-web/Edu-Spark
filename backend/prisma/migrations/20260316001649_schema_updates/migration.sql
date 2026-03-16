/*
  Warnings:

  - Added the required column `points` to the `quiz_questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `quizzes` DROP FOREIGN KEY `quizzes_lesson_id_fkey`;

-- DropIndex
DROP INDEX `quizzes_lesson_id_key` ON `quizzes`;

-- AlterTable
ALTER TABLE `courses` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `lessons` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `quiz_questions` ADD COLUMN `points` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `quizzes` ADD COLUMN `is_timed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `time_limit_seconds` INTEGER NULL;

-- AlterTable
ALTER TABLE `students` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `profile_image_url` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `enrollments` (
    `enrollment_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `enrolled_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `enrollments_student_id_course_id_key`(`student_id`, `course_id`),
    PRIMARY KEY (`enrollment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
