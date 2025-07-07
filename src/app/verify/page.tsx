"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  signInWithCustomToken,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";
import {
  ModalContainer,
  ModalOverlay,
  ModalButton,
  ModalError,
  ModalInput,
  ModalTitle,
} from "@/components/Modal";

export default function Verify() {
  const params = useSearchParams();
  const memberId = params.get("m");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, code }),
      });

      if (!res.ok) {
        setErr("Invalid or expired code");
        return;
      }
      const { customToken } = await res.json();
      await setPersistence(clientAuth, browserLocalPersistence);
      await signInWithCustomToken(clientAuth, customToken);
      const idToken = await clientAuth.currentUser!.getIdToken();
      await fetch("/api/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });
      router.replace("/");
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e);
        setErr(e.message || e.toString() || "An error occurred");
      } else {
        setErr("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer as="form" onSubmit={submit}>
        <ModalTitle>Verify your identity</ModalTitle>
        <ModalInput
          type="text"
          placeholder="Enter the 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="one-time-code"
          disabled={loading}
        />
        {err && <ModalError>{err}</ModalError>}
        <ModalButton type="submit" disabled={loading}>
          {loading ? "Verifying…" : "Verify"}
        </ModalButton>
      </ModalContainer>
    </ModalOverlay>
  );
}
