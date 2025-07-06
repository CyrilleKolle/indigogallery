import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server';

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: 60 * 60 * 24 * 30 * 1000,   // 30 days
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('__session', sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,             // seconds
    path: '/',
    sameSite: 'lax',
  });
  return res;
}
