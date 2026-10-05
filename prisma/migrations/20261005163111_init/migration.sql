-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MessageSource" AS ENUM ('CONTACT_FORM', 'SERVICE_REQUEST');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategoryTranslation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ServiceCategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceUrlEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTranslation" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "highlights" TEXT[],
    "rich" JSONB,
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "ServiceTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorTranslation" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialization" TEXT,
    "bio" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "DoctorTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQTranslation" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FAQTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryAlbum" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryAlbumTranslation" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "GalleryAlbumTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "source" "MessageSource" NOT NULL DEFAULT 'CONTACT_FORM',
    "serviceSlug" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'ar',
    "status" "MessageStatus" NOT NULL DEFAULT 'NEW',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonialTranslation" (
    "id" TEXT NOT NULL,
    "testimonialId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "TestimonialTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPostTranslation" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "BlogPostTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategoryTranslation_categoryId_locale_key" ON "ServiceCategoryTranslation"("categoryId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_status_sortOrder_idx" ON "Service"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "Service_categoryId_idx" ON "Service"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTranslation_serviceId_locale_key" ON "ServiceTranslation"("serviceId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_slug_key" ON "Doctor"("slug");

-- CreateIndex
CREATE INDEX "Doctor_status_sortOrder_idx" ON "Doctor"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorTranslation_doctorId_locale_key" ON "DoctorTranslation"("doctorId", "locale");

-- CreateIndex
CREATE INDEX "FAQ_status_sortOrder_idx" ON "FAQ"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "FAQTranslation_faqId_locale_key" ON "FAQTranslation"("faqId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryAlbum_slug_key" ON "GalleryAlbum"("slug");

-- CreateIndex
CREATE INDEX "GalleryAlbum_status_sortOrder_idx" ON "GalleryAlbum"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryAlbumTranslation_albumId_locale_key" ON "GalleryAlbumTranslation"("albumId", "locale");

-- CreateIndex
CREATE INDEX "GalleryImage_albumId_sortOrder_idx" ON "GalleryImage"("albumId", "sortOrder");

-- CreateIndex
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE INDEX "Testimonial_status_publishedAt_idx" ON "Testimonial"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Testimonial_createdAt_idx" ON "Testimonial"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonialTranslation_testimonialId_locale_key" ON "TestimonialTranslation"("testimonialId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_status_publishedAt_idx" ON "BlogPost"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPostTranslation_postId_locale_key" ON "BlogPostTranslation"("postId", "locale");

-- AddForeignKey
ALTER TABLE "ServiceCategoryTranslation" ADD CONSTRAINT "ServiceCategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTranslation" ADD CONSTRAINT "ServiceTranslation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTranslation" ADD CONSTRAINT "DoctorTranslation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQTranslation" ADD CONSTRAINT "FAQTranslation_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryAlbumTranslation" ADD CONSTRAINT "GalleryAlbumTranslation_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "GalleryAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "GalleryAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialTranslation" ADD CONSTRAINT "TestimonialTranslation_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "Testimonial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostTranslation" ADD CONSTRAINT "BlogPostTranslation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
