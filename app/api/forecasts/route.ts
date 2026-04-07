import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserForecasts } from "@/lib/db";
import { logError, isHistoryRateLimited, getClientIp } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (await isHistoryRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const forecasts = await getUserForecasts(userId, 20);
    return NextResponse.json({ forecasts });
  } catch (err) {
    logError("forecasts/list", err);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
