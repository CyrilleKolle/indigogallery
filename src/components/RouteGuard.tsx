"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const PUBLIC = ["/login", "/choose", "/verify"];

export default function RouteGuard() {
  const { user, ready, sessionReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!user && !PUBLIC.some((p) => pathname.startsWith(p))) {
      router.replace("/login");
      return;
    }
    if (user && !sessionReady) {
      return;
    }
    if (user && sessionReady && PUBLIC.some((p) => pathname.startsWith(p))) {
      router.replace("/");
    }
  }, [user, ready, pathname, router, sessionReady]);

  return null;
}
