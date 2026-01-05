import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const entry = await prisma.dailyChannelStats.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      subscribers: 100,
      totalViews: 5000,
      videoCount: 10,
      dailyViews: 200,
      dailyWatchTimeMinutes: 600,
      avgViewDurationSec: 180,
    },
  });

  return NextResponse.json(
    JSON.parse(
      JSON.stringify(entry, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    )
  );
}
