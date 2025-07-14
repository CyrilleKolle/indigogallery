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
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const [isSearchingMember, setIsSearchingMember] = useState(false);

  useEffect(() => {
    if (q.length < 2) {
      if (results.length) setResults([]);
      setIsSearchingMember(false);
      return;
    }

    setIsSearchingMember(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          "/api/member-search?q=" + encodeURIComponent(q)
        );
        if (res.ok) {
          const data: Member[] = await res.json();
          setResults((prev) => {
            if (prev.length === data.length) {
              const same = data.every((m, i) => m.id === prev[i].id);
              if (same) return prev;
            }
            return data;
          });
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setIsSearchingMember(false);
      }
    }, 200);

    return () => {
      clearTimeout(id);
      setIsSearchingMember(false);
    };
  }, [q]);

  const pick = async (m: Member) => {
    setIsSending(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: m.id }),
      });
      if (res.ok) router.push(`/verify?m=${m.id}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer as="div">
        <ModalTitle>Who might you be ?</ModalTitle>
        <ModalInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Write your secret name..."
          autoFocus
          disabled={isSending}
          autoComplete="off"
        />
        <ModalPickList
          items={results}
          onSelect={pick}
          getKey={(m: Member) => m.id}
          getLabel={(m: Member) => m.displayName}
          loading={isSending}
          placeholderText="Enter your secret name"
          isSearching={isSearchingMember}
          searchingText="Scanning..."
          noResultsText="No user found"
          hasQuery={q.length > 2}
        />
      </ModalContainer>
    </ModalOverlay>
  );
}
