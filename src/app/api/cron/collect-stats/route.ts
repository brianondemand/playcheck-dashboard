/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { youtubeFetch } from "@/app/lib/youtube";
import { getTodayUTC, getYesterdayUTC } from "@/app/lib/dates";

export async function GET() {
  const today = getTodayUTC();
  const { start, end } = getYesterdayUTC();

  const channelRes = await youtubeFetch<any>(
    "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true"
  );

  const stats = channelRes.items?.[0]?.statistics;
  if (!stats) {
    return NextResponse.json(
      { error: "No channel stats found" },
      { status: 500 }
    );
  }

  const analyticsUrl =
    "https://youtubeanalytics.googleapis.com/v2/reports" +
    `?ids=channel==MINE` +
    `&startDate=${start}` +
    `&endDate=${end}` +
    `&metrics=views,estimatedMinutesWatched,averageViewDuration`;

  const analyticsRes = await youtubeFetch<any>(analyticsUrl);

  const row = analyticsRes.rows?.[0] ?? [0, 0, 0];

  const dailyViews = row[0];
  const dailyWatchTimeMinutes = row[1];
  const avgViewDurationSec = Math.round(row[2]);

  const record = await prisma.dailyChannelStats.upsert({
    where: { date: today },
    update: {
      subscribers: Number(stats.subscriberCount),
      totalViews: BigInt(stats.viewCount),
      videoCount: Number(stats.videoCount),
      dailyViews,
      dailyWatchTimeMinutes,
      avgViewDurationSec,
    },
    create: {
      date: today,
      subscribers: Number(stats.subscriberCount),
      totalViews: BigInt(stats.viewCount),
      videoCount: Number(stats.videoCount),
      dailyViews,
      dailyWatchTimeMinutes,
      avgViewDurationSec,
    },
  });

  return NextResponse.json({
    message: "Daily stats collected",
    record: {
      ...record,
      totalViews: record.totalViews.toString(),
    },
  });
}
