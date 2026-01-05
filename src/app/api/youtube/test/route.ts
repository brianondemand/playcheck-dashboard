/* eslint-disable @typescript-eslint/no-explicit-any */
import { youtubeFetch } from "@/app/lib/youtube";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await youtubeFetch<any>(
    "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true"
  );

  return NextResponse.json(data);
}
