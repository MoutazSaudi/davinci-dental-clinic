CREATE TABLE "VideoSetting" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VideoSetting_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "VideoSetting_singleton" CHECK ("id" = 'showcase')
);
