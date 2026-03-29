import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getForecast } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const forecast = await getForecast(id, userId);
    return NextResponse.json({ forecast });
  } catch (err) {
    console.error("Failed to fetch forecast:", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
