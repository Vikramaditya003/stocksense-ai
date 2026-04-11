import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { addToWaitlist } from "@/lib/db";
import { isStrictRateLimited, getClientIp, sanitizeError, logError } from "@/lib/security";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (await isStrictRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Sign in to join the waitlist." }, { status: 401 });
  }

  const clerkUser = await currentUser();
  const primaryEmailId = clerkUser?.primaryEmailAddressId;
  const email =
    clerkUser?.emailAddresses.find((e) => e.id === primaryEmailId)?.emailAddress ?? "";

  if (!email) {
    return NextResponse.json({ success: false, error: "No email on your account." }, { status: 400 });
  }

  try {
    await addToWaitlist(userId, email);
    return NextResponse.json({ success: true });
  } catch (error) {
    logError("waitlist/add", error);
    return NextResponse.json({ success: false, error: sanitizeError(error) }, { status: 500 });
  }
}
