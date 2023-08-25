/*
  Warnings:

  - The primary key for the `dopy_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `dopy_images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[filePath]` on the table `dopy_images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filePath` to the `dopy_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DopyImageToTag" DROP CONSTRAINT "_DopyImageToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DopyImageToUser" DROP CONSTRAINT "_DopyImageToUser_A_fkey";

-- DropIndex
DROP INDEX "dopy_images_id_key";

-- DropIndex
DROP INDEX "events_id_key";

-- AlterTable
ALTER TABLE "dopy_images" DROP CONSTRAINT "dopy_images_pkey",
DROP COLUMN "id",
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD CONSTRAINT "dopy_images_pkey" PRIMARY KEY ("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "dopy_images_filePath_key" ON "dopy_images"("filePath");

-- AddForeignKey
ALTER TABLE "_DopyImageToTag" ADD CONSTRAINT "_DopyImageToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "dopy_images"("filePath") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DopyImageToUser" ADD CONSTRAINT "_DopyImageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "dopy_images"("filePath") ON DELETE CASCADE ON UPDATE CASCADE;
