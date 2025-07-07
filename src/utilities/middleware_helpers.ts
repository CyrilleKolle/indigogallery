import { jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";

const ONBOARD = ["/login", "/choose", "/verify"];
const PUBLIC_ASSET = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".hdr",
  ".json",
  ".svg",
];
const PUBLIC_ROUTES = ["/robots.txt", "/favicon.ico"];

export function isPublic(path: string): boolean {
  return (
    path.startsWith("/api") ||
    PUBLIC_ROUTES.some((p) => path === p) ||
    PUBLIC_ASSET.some((ext) => path.endsWith(ext)) ||
    path.startsWith("/_next/") // Next internals
  );
}

export function isOnboard(path: string): boolean {
  return ONBOARD.some((p) => path.startsWith(p));
}

type ValidateSessionOptions = {
  projectId: string;
  token?: string;
  jwks: ReturnType<typeof createRemoteJWKSet>;
};
export async function hasValidSession({
  projectId,
  token,
  jwks,
}: ValidateSessionOptions): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://session.firebase.google.com/${projectId}`,
      audience: projectId,
    });
    // Optionally check for 'sub' property if needed:
    // TODO: remove this check if not needed or buggy
    // This was just to ensure the token has a subject (user ID) field
     if (!(payload as JWTPayload & { sub?: string }).sub) return false;
    return true;
  } catch (err: unknown) {
    console.error("jwtVerify failed:", err);
    return false;
  }
}
