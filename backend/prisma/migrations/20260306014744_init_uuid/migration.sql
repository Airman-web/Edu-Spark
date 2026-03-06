-- CreateTable
CREATE TABLE `guardians` (
    `guardian_id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `guardians_email_key`(`email`),
    UNIQUE INDEX `guardians_phone_number_key`(`phone_number`),
    PRIMARY KEY (`guardian_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grade_groups` (
    `grade_group_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `grade_groups_name_key`(`name`),
    PRIMARY KEY (`grade_group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `student_id` VARCHAR(191) NOT NULL,
    `guardian_id` VARCHAR(191) NOT NULL,
    `grade_group_id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `display_name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `date_of_birth` DATE NULL,
    `disability_info` VARCHAR(100) NULL,
    `profile_image_url` VARCHAR(191) NULL,

    UNIQUE INDEX `students_display_name_key`(`display_name`),
    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses` (
    `course_id` VARCHAR(191) NOT NULL,
    `grade_group_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `courses_title_grade_group_id_key`(`title`, `grade_group_id`),
    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lessons` (
    `lesson_id` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content_type` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `points_reward` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `lessons_title_course_id_key`(`title`, `course_id`),
    PRIMARY KEY (`lesson_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quizzes` (
    `quiz_id` VARCHAR(191) NOT NULL,
    `lesson_id` VARCHAR(191) NOT NULL,
    `total_points` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `quizzes_lesson_id_key`(`lesson_id`),
    PRIMARY KEY (`quiz_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_questions` (
    `question_id` VARCHAR(191) NOT NULL,
    `quiz_id` VARCHAR(191) NOT NULL,
    `question_text` TEXT NOT NULL,

    UNIQUE INDEX `quiz_questions_quiz_id_question_text_key`(`quiz_id`, `question_text`(500)),
    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_options` (
    `option_id` VARCHAR(191) NOT NULL,
    `question_id` VARCHAR(191) NOT NULL,
    `option_text` VARCHAR(200) NOT NULL,
    `is_correct` BOOLEAN NOT NULL,

    UNIQUE INDEX `quiz_options_question_id_option_text_key`(`question_id`, `option_text`),
    PRIMARY KEY (`option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_lesson_progress` (
    `progress_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `lesson_id` VARCHAR(191) NOT NULL,
    `progress_percentage` DECIMAL(5, 2) NOT NULL,
    `completed` BOOLEAN NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `student_lesson_progress_student_id_lesson_id_key`(`student_id`, `lesson_id`),
    PRIMARY KEY (`progress_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_quiz_attempts` (
    `attempt_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `quiz_id` VARCHAR(191) NOT NULL,
    `score` DECIMAL(10, 2) NOT NULL,
    `completed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`attempt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `points_history` (
    `points_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `points` DECIMAL(10, 2) NOT NULL,
    `source_type` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`points_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_guardian_id_fkey` FOREIGN KEY (`guardian_id`) REFERENCES `guardians`(`guardian_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_grade_group_id_fkey` FOREIGN KEY (`grade_group_id`) REFERENCES `grade_groups`(`grade_group_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_grade_group_id_fkey` FOREIGN KEY (`grade_group_id`) REFERENCES `grade_groups`(`grade_group_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`quiz_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_options` ADD CONSTRAINT `quiz_options_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`question_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_lesson_progress` ADD CONSTRAINT `student_lesson_progress_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_lesson_progress` ADD CONSTRAINT `student_lesson_progress_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_quiz_attempts` ADD CONSTRAINT `student_quiz_attempts_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_quiz_attempts` ADD CONSTRAINT `student_quiz_attempts_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`quiz_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `points_history` ADD CONSTRAINT `points_history_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
