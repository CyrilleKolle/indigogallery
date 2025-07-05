"server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

type PreAuthPayload = {
  stage: "pre";
  iat: number;
  exp: number;
};

const PRE_AUTH_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyPreAuth(): Promise<PreAuthPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get("preAuth")?.value;
  if (!token) throw new Error("Unauthenticated: missing preAuth cookie");

  try {
    const { payload } = await jwtVerify(token, PRE_AUTH_SECRET);
    if (payload.stage !== "pre") throw new Error("Unexpected JWT stage");
    return payload as PreAuthPayload;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`JWT verification failed: ${errorMessage}`);
  }
}
