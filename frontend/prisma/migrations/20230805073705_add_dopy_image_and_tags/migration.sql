-- CreateTable
CREATE TABLE "DopyImage" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "DopyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DopyImageToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DopyImageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DopyImage_id_key" ON "DopyImage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_id_key" ON "Tag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_DopyImageToTag_AB_unique" ON "_DopyImageToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_DopyImageToTag_B_index" ON "_DopyImageToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DopyImageToUser_AB_unique" ON "_DopyImageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DopyImageToUser_B_index" ON "_DopyImageToUser"("B");

-- AddForeignKey
ALTER TABLE "DopyImage" ADD CONSTRAINT "DopyImage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DopyImageToTag" ADD CONSTRAINT "_DopyImageToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "DopyImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DopyImageToTag" ADD CONSTRAINT "_DopyImageToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DopyImageToUser" ADD CONSTRAINT "_DopyImageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "DopyImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DopyImageToUser" ADD CONSTRAINT "_DopyImageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
