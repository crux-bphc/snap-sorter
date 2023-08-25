/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tags_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "tags_value_key" ON "tags"("value");
