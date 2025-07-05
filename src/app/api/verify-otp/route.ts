import { NextRequest, NextResponse } from "next/server";
import { db, adminAuth } from "@/lib/server";
import { verifyPreAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface MemberDoc {
  otpHash: string;
  otpExpires: number;
}

export async function POST(req: NextRequest) {
  const { memberId, code } = await req.json();
  await verifyPreAuth();

  const snap = await db.collection("members").doc(memberId).get();
  if (!snap.exists) return NextResponse.json({}, { status: 404 });

  const data = snap.data() as MemberDoc;

  if (!data?.otpHash || !data?.otpExpires)
    return NextResponse.json({}, { status: 400 });

  const ok = await bcrypt.compare(code, data.otpHash);
  if (!ok || Date.now() > data.otpExpires)
    return NextResponse.json({}, { status: 401 });

  await snap.ref.update({ otpHash: "", otpExpires: 0 });

  const customToken = await adminAuth.createCustomToken(memberId);

  return NextResponse.json({ customToken });
}
