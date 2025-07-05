"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ModalContainer,
  ModalOverlay,
  ModalButton,
  ModalError,
  ModalInput,
  ModalTitle,
} from "@/components/Modal";

export default function Login() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const res = await fetch("/api/verify-pass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    console.log("res", res);

    if (res.ok) {
      router.push("/choose");
    } else {
      setErr("Wrong key 🙈");
    }
    setLoading(false);
  };

  return (
    <ModalOverlay>
      <ModalContainer as="form" onSubmit={submit}>
        <ModalTitle>Enter access key</ModalTitle>
        <ModalInput
          type="password"
          placeholder="Access key"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          disabled={loading}
        />
        {err && <ModalError>{err}</ModalError>}
        <ModalButton
          type="submit"
          disabled={loading}
        >
          {loading ? "Checking…" : "Enter"}
        </ModalButton>
      </ModalContainer>
    </ModalOverlay>
  );
}
