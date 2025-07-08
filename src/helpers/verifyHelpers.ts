import {
  signInWithCustomToken,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";

export async function verifyOtp(memberId: string | null, code: string) {
  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, code }),
  });
  if (!res.ok) {
    throw new Error("Invalid or expired code");
  }
  const { customToken } = await res.json();
  return customToken as string;
}

export async function firebaseAuthenticate(customToken: string) {
  await setPersistence(clientAuth, browserLocalPersistence);
  await signInWithCustomToken(clientAuth, customToken);
  const idToken = await clientAuth.currentUser!.getIdToken();
  return idToken;
}

export async function sessionLogin(idToken: string) {
  const res = await fetch("/api/session-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, target: "/" }),
    credentials: "include",
    redirect: "manual",
  });

  if (res.status >= 400) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error || `session-login failed (${res.status})`);
  }
}