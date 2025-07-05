import { db } from "@/lib/server";
import { sendEmailOtp } from "@/lib/mailer";
import { verifyPreAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { memberId } = await req.json();
  await verifyPreAuth();

  const ref = db.collection("members").doc(memberId);
  const doc = await ref.get();
  if (!doc.exists) return NextResponse.json({}, { status: 404 });

  // throttle: deny if sent <2 min ago
  if (Date.now() - doc.data()?.lastOtpSentAt < 120_000)
    return NextResponse.json({}, { status: 429 });

  const code = Math.floor(100_000 + Math.random() * 900_000).toString(); // 6 digits
  const hash = await bcrypt.hash(code, 10);
  await ref.update({
    otpHash: hash,
    otpExpires: Date.now() + 10 * 60_000,
    lastOtpSentAt: Date.now(),
  });
  //TODO: use a real email service
  // For now, we just log the code to the console from api route (Done inside sendEmailOtp)
  await sendEmailOtp(doc.data()?.email, code);
  return NextResponse.json({ ok: true });
}
