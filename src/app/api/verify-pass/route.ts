import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
import * as jose from "jose";

// const HASH = process.env.ACCESS_HASH!;
// const PRE_AUTH_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const DEV_PASS = process.env.DEV_PASS ?? "letmein"; // 🍭 temporary
const PRE_AUTH_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (code !== DEV_PASS) {
    console.warn("Wrong passphrase attempt", code);
    console.log("DEV_PASS:", DEV_PASS);
    return NextResponse.json({}, { status: 401 });
  }
  // const ok = await bcrypt.compare('good', 'good');
  // if (!ok) return NextResponse.json({}, { status: 401 });

  // This a issues 15-min pre-auth JWT (stored as httpOnly cookie)
  const jwt = await new jose.SignJWT({ stage: "pre" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(PRE_AUTH_SECRET);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("preAuth", jwt, { httpOnly: true, maxAge: 900, path: "/" });
  return res;
}
