"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ModalContainer,
  ModalOverlay,
  ModalButton,
  ModalError,
  ModalInput,
  ModalTitle,
} from "@/components/Modal";
import { useAuth } from "@/components/AuthProvider";
import { verifyOtp, sessionLogin, firebaseAuthenticate } from "@/helpers";

export default function Verify() {
  const params = useSearchParams();
  const memberId = params.get("m");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { markSessionReady } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const customToken = await verifyOtp(memberId, code);
      const idToken = await firebaseAuthenticate(customToken);
      await sessionLogin(idToken);

      markSessionReady();
      router.replace("/", { scroll: false });
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "An unexpected error occurred";
      console.error(e);
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer as="form" onSubmit={handleSubmit}>
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
