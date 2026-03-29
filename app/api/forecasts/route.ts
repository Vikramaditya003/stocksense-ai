import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserForecasts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const forecasts = await getUserForecasts(userId, 20);
    return NextResponse.json({ forecasts });
  } catch (err) {
    console.error("Failed to fetch forecasts:", err);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
