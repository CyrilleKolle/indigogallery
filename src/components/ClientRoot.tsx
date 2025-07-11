"use client";

import { YearGlobe } from "@/components/YearWheel";
import { useAuth } from "./AuthProvider";
import ClientHeader from "./ClientHeader";
import clsx from "clsx";

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const globeLocked = !ready || !user;
  return (
    <>
      <div className={`fixed inset-0 z-50`}>
        <div className={HEADER_STYLE}>{user && <ClientHeader />}</div>
        <div
          className={clsx(GLOBE_STYLE, globeLocked ? GLOBE_LOCKED_STYLE : "")}
        >
          <YearGlobe />
        </div>
      </div>
      {children}
    </>
  );
}

const GLOBE_STYLE = clsx("fixed bottom-0 left-0 right-0 z-10");
const GLOBE_LOCKED_STYLE = clsx("pointer-events-none opacity-40");
const HEADER_STYLE = clsx("fixed top-0 left-0 right-0 z-90");
