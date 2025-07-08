import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet } from "jose";
import { hasValidSession, isOnboard, isPublic } from "./utilities";

const projectId = process.env.FB_PROJECT_ID!;
const jwksUri = process.env.NEXT_PUBLIC_JWK_URI!;

if (!projectId)
  throw new Error("Env NEXT_PUBLIC_FIREBASE_PROJECT_ID is required");
if (!jwksUri) throw new Error("Env NEXT_PUBLIC_JWK_URI is required");

const jwks = createRemoteJWKSet(new URL(jwksUri));

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const url = req.nextUrl.clone(); // I mutate the `url.pathname` for redirects
  const preAuth = req.cookies.get("preAuth");
  const validSess = await hasValidSession({
    projectId,
    token: req.cookies.get("__session")?.value,
    jwks,
  });

  if (isPublic(path)) return NextResponse.next();

  if (!validSess && !preAuth && !path.startsWith("/login")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (preAuth && !validSess && !isOnboard(path)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (validSess && preAuth) {
    const res = NextResponse.next();
    res.cookies.set("preAuth", "", { maxAge: 0, path: "/", sameSite: "lax" });
    return res;
  }

  if (validSess && isOnboard(path)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/|favicon.ico).*)",
};
