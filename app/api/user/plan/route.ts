import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserPlan, getForecastCount } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ plan: "free", forecastCount: 0 });
  }
  const [plan, forecastCount] = await Promise.all([
    getUserPlan(userId),
    getForecastCount(userId),
  ]);
  return NextResponse.json({ plan, forecastCount });
}
