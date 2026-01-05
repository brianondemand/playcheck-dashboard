import { prisma } from "@/app/lib/prisma";

const TOKEN_URL = "https://oauth2.googleapis.com/token";

async function getAccessToken(): Promise<string> {
  const config = await prisma.appConfig.findUnique({
    where: { key: "google_refresh_token" },
  });
    

  if (!config) {
    throw new Error("No refresh token found. Run OAuth first.");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: config.value,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  return data.access_token;
}

export async function youtubeFetch<T>(url: string): Promise<T> {
  const accessToken = await getAccessToken();

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`YouTube API error: ${res.status}`);
  }

  return res.json();
}
