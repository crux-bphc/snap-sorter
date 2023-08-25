/*
  Warnings:

  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DopyImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DopyImage" DROP CONSTRAINT "DopyImage_eventId_fkey";

-- DropForeignKey
ALTER TABLE "_DopyImageToTag" DROP CONSTRAINT "_DopyImageToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DopyImageToTag" DROP CONSTRAINT "_DopyImageToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "_DopyImageToUser" DROP CONSTRAINT "_DopyImageToUser_A_fkey";

-- DropTable
DROP TABLE "Announcement";

-- DropTable
DROP TABLE "DopyImage";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Tag";

-- CreateTable
CREATE TABLE "announcements" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dopy_images" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "dopy_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dopy_images_id_key" ON "dopy_images"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_id_key" ON "tags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "events_id_key" ON "events"("id");

-- AddForeignKey
ALTER TABLE "dopy_images" ADD CONSTRAINT "dopy_images_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DopyImageToTag" ADD CONSTRAINT "_DopyImageToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "dopy_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DopyImageToTag" ADD CONSTRAINT "_DopyImageToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DopyImageToUser" ADD CONSTRAINT "_DopyImageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "dopy_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
