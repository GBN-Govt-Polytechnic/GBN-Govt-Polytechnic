-- CreateEnum
CREATE TYPE "admin_role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'HOD', 'TPO', 'MEDIA_MANAGER', 'NEWS_EDITOR');

-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "news_category" AS ENUM ('NEWS', 'NOTICE', 'CIRCULAR', 'TENDER');

-- CreateEnum
CREATE TYPE "course_type" AS ENUM ('THEORY', 'PRACTICAL', 'ELECTIVE');

-- CreateEnum
CREATE TYPE "placement_activity_type" AS ENUM ('DRIVE', 'WORKSHOP', 'SEMINAR', 'MOCK_INTERVIEW');

-- CreateEnum
CREATE TYPE "inquiry_status" AS ENUM ('NEW', 'READ', 'RESPONDED');

-- CreateEnum
CREATE TYPE "academic_document_type" AS ENUM ('LESSON_PLAN', 'SYLLABUS', 'TIMETABLE');

-- CreateEnum
CREATE TYPE "submission_type" AS ENUM ('CONTACT', 'COMPLAINT');

-- CreateEnum
CREATE TYPE "audit_action" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- CreateEnum
CREATE TYPE "BannerVariant" AS ENUM ('INFO', 'WARNING', 'URGENT', 'SUCCESS');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "admin_role" NOT NULL DEFAULT 'ADMIN',
    "department_id" UUID,
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "hod_name" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_sessions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "department_id" UUID NOT NULL,
    "specialization" TEXT,
    "experience" TEXT,
    "photo_url" TEXT,
    "photo_file_name" TEXT,
    "photo_file_size" INTEGER,
    "photo_mime_type" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labs" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "room_number" TEXT,
    "department_id" UUID NOT NULL,
    "description" TEXT,
    "equipment" JSONB,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "labs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department_id" UUID NOT NULL,
    "semester" INTEGER NOT NULL,
    "type" "course_type" NOT NULL,
    "credits" INTEGER,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_materials" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "department_id" UUID NOT NULL,
    "semester" INTEGER NOT NULL,
    "session_id" UUID NOT NULL,
    "uploaded_by_id" UUID NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_mime_type" TEXT NOT NULL,
    "status" "content_status" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "study_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_documents" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "type" "academic_document_type" NOT NULL,
    "department_id" UUID NOT NULL,
    "semester" INTEGER NOT NULL,
    "session_id" UUID NOT NULL,
    "faculty_name" TEXT,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_mime_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "academic_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_notices" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" "news_category" NOT NULL,
    "status" "content_status" NOT NULL DEFAULT 'DRAFT',
    "publish_date" TIMESTAMP(3),
    "image_url" TEXT,
    "image_file_name" TEXT,
    "image_file_size" INTEGER,
    "image_mime_type" TEXT,
    "attachment_url" TEXT,
    "attachment_file_name" TEXT,
    "attachment_file_size" INTEGER,
    "attachment_mime_type" TEXT,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "news_notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "location" TEXT,
    "status" "content_status" NOT NULL DEFAULT 'DRAFT',
    "image_url" TEXT,
    "image_file_name" TEXT,
    "image_file_size" INTEGER,
    "image_mime_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_albums" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "cover_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gallery_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" UUID NOT NULL,
    "album_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_file_name" TEXT NOT NULL,
    "image_file_size" INTEGER NOT NULL,
    "image_mime_type" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "image_url" TEXT NOT NULL,
    "link_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_links" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "semester" INTEGER,
    "year" INTEGER,
    "session_id" UUID,
    "external_url" TEXT,
    "file_url" TEXT,
    "file_name" TEXT,
    "file_size" INTEGER,
    "file_mime_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "result_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_companies" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "placement_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_stats" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "students_placed" INTEGER NOT NULL DEFAULT 0,
    "total_students" INTEGER NOT NULL DEFAULT 0,
    "highest_package" DOUBLE PRECISION,
    "average_package" DOUBLE PRECISION,
    "companies_visited" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placement_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_activities" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "type" "placement_activity_type" NOT NULL,
    "company_id" UUID,
    "department_id" UUID,
    "session_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "students_participated" INTEGER,
    "students_selected" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "placement_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" UUID NOT NULL,
    "type" "submission_type" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "inquiry_status" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mous" (
    "id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "signed_date" DATE,
    "valid_until" DATE,
    "document_url" TEXT,
    "document_file_name" TEXT,
    "document_file_size" INTEGER,
    "document_mime_type" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "mous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATE,
    "image_url" TEXT,
    "image_file_name" TEXT,
    "image_file_size" INTEGER,
    "image_mime_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "action" "audit_action" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "admin_id" UUID,
    "before" JSONB,
    "after" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link_url" TEXT,
    "link_text" TEXT,
    "variant" "BannerVariant" NOT NULL DEFAULT 'INFO',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_email_idx" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_role_idx" ON "admin_users"("role");

-- CreateIndex
CREATE INDEX "admin_users_department_id_idx" ON "admin_users"("department_id");

-- CreateIndex
CREATE INDEX "admin_users_is_active_idx" ON "admin_users"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_slug_key" ON "departments"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE INDEX "departments_slug_idx" ON "departments"("slug");

-- CreateIndex
CREATE INDEX "departments_code_idx" ON "departments"("code");

-- CreateIndex
CREATE INDEX "departments_is_active_idx" ON "departments"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "academic_sessions_name_key" ON "academic_sessions"("name");

-- CreateIndex
CREATE INDEX "academic_sessions_is_current_idx" ON "academic_sessions"("is_current");

-- CreateIndex
CREATE INDEX "faculty_department_id_idx" ON "faculty"("department_id");

-- CreateIndex
CREATE INDEX "faculty_sort_order_idx" ON "faculty"("sort_order");

-- CreateIndex
CREATE INDEX "faculty_is_active_idx" ON "faculty"("is_active");

-- CreateIndex
CREATE INDEX "labs_department_id_idx" ON "labs"("department_id");

-- CreateIndex
CREATE INDEX "labs_is_active_idx" ON "labs"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE INDEX "courses_code_idx" ON "courses"("code");

-- CreateIndex
CREATE INDEX "courses_department_id_idx" ON "courses"("department_id");

-- CreateIndex
CREATE INDEX "courses_semester_idx" ON "courses"("semester");

-- CreateIndex
CREATE INDEX "courses_type_idx" ON "courses"("type");

-- CreateIndex
CREATE INDEX "courses_is_active_idx" ON "courses"("is_active");

-- CreateIndex
CREATE INDEX "study_materials_department_id_idx" ON "study_materials"("department_id");

-- CreateIndex
CREATE INDEX "study_materials_semester_idx" ON "study_materials"("semester");

-- CreateIndex
CREATE INDEX "study_materials_session_id_idx" ON "study_materials"("session_id");

-- CreateIndex
CREATE INDEX "study_materials_status_idx" ON "study_materials"("status");

-- CreateIndex
CREATE INDEX "academic_documents_type_idx" ON "academic_documents"("type");

-- CreateIndex
CREATE INDEX "academic_documents_department_id_idx" ON "academic_documents"("department_id");

-- CreateIndex
CREATE INDEX "academic_documents_session_id_idx" ON "academic_documents"("session_id");

-- CreateIndex
CREATE INDEX "academic_documents_semester_idx" ON "academic_documents"("semester");

-- CreateIndex
CREATE UNIQUE INDEX "news_notices_slug_key" ON "news_notices"("slug");

-- CreateIndex
CREATE INDEX "news_notices_slug_idx" ON "news_notices"("slug");

-- CreateIndex
CREATE INDEX "news_notices_category_idx" ON "news_notices"("category");

-- CreateIndex
CREATE INDEX "news_notices_status_idx" ON "news_notices"("status");

-- CreateIndex
CREATE INDEX "news_notices_publish_date_idx" ON "news_notices"("publish_date");

-- CreateIndex
CREATE INDEX "news_notices_is_pinned_idx" ON "news_notices"("is_pinned");

-- CreateIndex
CREATE INDEX "news_notices_status_category_publish_date_idx" ON "news_notices"("status", "category", "publish_date");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_start_date_idx" ON "events"("start_date");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_albums_slug_key" ON "gallery_albums"("slug");

-- CreateIndex
CREATE INDEX "gallery_albums_slug_idx" ON "gallery_albums"("slug");

-- CreateIndex
CREATE INDEX "gallery_albums_is_published_idx" ON "gallery_albums"("is_published");

-- CreateIndex
CREATE INDEX "gallery_images_album_id_idx" ON "gallery_images"("album_id");

-- CreateIndex
CREATE INDEX "gallery_images_sort_order_idx" ON "gallery_images"("sort_order");

-- CreateIndex
CREATE INDEX "hero_slides_sort_order_idx" ON "hero_slides"("sort_order");

-- CreateIndex
CREATE INDEX "hero_slides_is_active_idx" ON "hero_slides"("is_active");

-- CreateIndex
CREATE INDEX "result_links_session_id_idx" ON "result_links"("session_id");

-- CreateIndex
CREATE INDEX "result_links_year_idx" ON "result_links"("year");

-- CreateIndex
CREATE INDEX "result_links_semester_idx" ON "result_links"("semester");

-- CreateIndex
CREATE INDEX "placement_companies_is_active_idx" ON "placement_companies"("is_active");

-- CreateIndex
CREATE INDEX "placement_stats_department_id_idx" ON "placement_stats"("department_id");

-- CreateIndex
CREATE INDEX "placement_stats_session_id_idx" ON "placement_stats"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "placement_stats_department_id_session_id_key" ON "placement_stats"("department_id", "session_id");

-- CreateIndex
CREATE INDEX "placement_activities_type_idx" ON "placement_activities"("type");

-- CreateIndex
CREATE INDEX "placement_activities_company_id_idx" ON "placement_activities"("company_id");

-- CreateIndex
CREATE INDEX "placement_activities_department_id_idx" ON "placement_activities"("department_id");

-- CreateIndex
CREATE INDEX "placement_activities_session_id_idx" ON "placement_activities"("session_id");

-- CreateIndex
CREATE INDEX "placement_activities_date_idx" ON "placement_activities"("date");

-- CreateIndex
CREATE INDEX "submissions_type_idx" ON "submissions"("type");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"("status");

-- CreateIndex
CREATE INDEX "submissions_created_at_idx" ON "submissions"("created_at");

-- CreateIndex
CREATE INDEX "mous_is_active_idx" ON "mous"("is_active");

-- CreateIndex
CREATE INDEX "achievements_date_idx" ON "achievements"("date");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_idx" ON "audit_logs"("entity_type");

-- CreateIndex
CREATE INDEX "audit_logs_admin_id_idx" ON "audit_logs"("admin_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "banners_is_active_idx" ON "banners"("is_active");

-- CreateIndex
CREATE INDEX "banners_start_date_end_date_idx" ON "banners"("start_date", "end_date");

-- AddForeignKey
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labs" ADD CONSTRAINT "labs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_documents" ADD CONSTRAINT "academic_documents_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_documents" ADD CONSTRAINT "academic_documents_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "gallery_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_links" ADD CONSTRAINT "result_links_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "academic_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_stats" ADD CONSTRAINT "placement_stats_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_stats" ADD CONSTRAINT "placement_stats_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_activities" ADD CONSTRAINT "placement_activities_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "placement_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_activities" ADD CONSTRAINT "placement_activities_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_activities" ADD CONSTRAINT "placement_activities_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "academic_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
