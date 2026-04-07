import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getForecast } from "@/lib/db";
import { logError, isHistoryRateLimited, getClientIp } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);
  if (await isHistoryRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    // Validate UUID format — prevents path traversal and SQL injection attempts
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid forecast ID." }, { status: 400 });
    }

    const forecast = await getForecast(id, userId);
    return NextResponse.json({ forecast });
  } catch (err) {
    logError("forecasts/get", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
