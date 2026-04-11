import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { saveFeedback } from "@/lib/db";
import { isStrictRateLimited, getClientIp, sanitizeError, logError } from "@/lib/security";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendReady = resendKey.startsWith("re_") && resendKey.length > 20;
const FEEDBACK_RECIPIENT = process.env.FEEDBACK_EMAIL ?? "support@getforestock.com";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (await isStrictRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  const { userId } = await auth();

  try {
    const body = await req.json();
    const npsScore = Number(body.nps_score);
    const message = String(body.message ?? "").slice(0, 1000).trim();
    const page = String(body.page ?? "unknown").slice(0, 100);

    if (isNaN(npsScore) || npsScore < 1 || npsScore > 10) {
      return NextResponse.json({ success: false, error: "Invalid score." }, { status: 400 });
    }

    await saveFeedback({
      clerk_user_id: userId ?? undefined,
      nps_score: npsScore,
      message,
      page,
    });

    if (resendReady) {
      const resend = new Resend(resendKey);
      const label =
        npsScore >= 9 ? "Promoter 🟢" : npsScore >= 7 ? "Passive 🟡" : "Detractor 🔴";
      await resend.emails.send({
        from: "Forestock Feedback <hello@getforestock.com>",
        to: FEEDBACK_RECIPIENT,
        subject: `[Feedback] ${npsScore}/10 · ${label} · ${page}`,
        text: [
          `New feedback received on Forestock.`,
          ``,
          `Score:   ${npsScore}/10  (${label})`,
          `Page:    ${page}`,
          `User:    ${userId ?? "anonymous"}`,
          ``,
          `What they said:`,
          message || "(no message)",
        ].join("\n"),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("feedback/save", error);
    return NextResponse.json({ success: false, error: sanitizeError(error) }, { status: 500 });
  }
}
