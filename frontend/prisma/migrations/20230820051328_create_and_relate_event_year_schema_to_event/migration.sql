-- CreateTable
CREATE TABLE "event_years" (
    "year" INTEGER NOT NULL,

    CONSTRAINT "event_years_pkey" PRIMARY KEY ("year")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_year_fkey" FOREIGN KEY ("year") REFERENCES "event_years"("year") ON DELETE RESTRICT ON UPDATE CASCADE;
