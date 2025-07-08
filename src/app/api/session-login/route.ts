import { adminAuth } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

const TWO_WEEKS_MS = 1000 * 60 * 60 * 24 * 14;
const TWO_WEEKS_S = TWO_WEEKS_MS / 1000;

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: TWO_WEEKS_MS,
    });

    const res = NextResponse.json({ ok: true, target: "/" }, { status: 200 });
    res.cookies.set({
      name: "__session",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TWO_WEEKS_S,
    });
    return res;
  } catch (err) {
    console.error("session-login failed:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 401 }
    );
  }
}
