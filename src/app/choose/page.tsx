"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ModalContainer,
  ModalOverlay,
  ModalInput,
  ModalTitle,
  ModalPickList,
} from "@/components/Modal";

interface Member {
  id: string;
  displayName: string;
}

export default function Choose() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // query members as user types
  useEffect(() => {
    if (q.length < 2) return setResults([]);
    const id = setTimeout(async () => {
      const res = await fetch("/api/member-search?q=" + encodeURIComponent(q));
      console.log("searching for", q);
      console.log("res", res);
      if (res.ok) setResults(await res.json());
    }, 200);
    return () => clearTimeout(id);
  }, [q]);

  const pick = async (m: Member) => {
    setLoading(true);
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: m.id }),
    });
    if (res.ok) router.push(`/verify?m=${m.id}`);
    setLoading(false);
  };

  return (
    <ModalOverlay>
      <ModalContainer as="div">
        <ModalTitle>Who might you be ?</ModalTitle>
        <ModalInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Start typing your name…"
          autoFocus
          disabled={loading}
          autoComplete="off"
        />
        <ModalPickList
          items={results}
          onSelect={pick}
          getKey={(m: Member) => m.id}
          getLabel={(m: Member) => m.displayName}
        />
      </ModalContainer>
    </ModalOverlay>
  );
}
