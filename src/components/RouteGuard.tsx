"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const PUBLIC = ["/login", "/choose", "/verify"];

export default function RouteGuard() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!user && !PUBLIC.includes(pathname)) {
      router.replace("/login");
    }
    if (user && PUBLIC.includes(pathname)) {
      router.replace("/");
    }
  }, [user, ready, pathname, router]);

  return null;
}
