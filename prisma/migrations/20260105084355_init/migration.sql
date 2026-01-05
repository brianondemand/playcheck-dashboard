-- CreateTable
CREATE TABLE "DailyChannelStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "subscribers" INTEGER NOT NULL,
    "totalViews" BIGINT NOT NULL,
    "videoCount" INTEGER NOT NULL,
    "dailyViews" INTEGER NOT NULL,
    "dailyWatchTimeMinutes" INTEGER NOT NULL,
    "avgViewDurationSec" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyChannelStats_date_key" ON "DailyChannelStats"("date");
