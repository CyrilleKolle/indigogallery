"use client";

import { YearGlobe } from "@/components/YearWheel";
import { useAuth } from "./AuthProvider";
import ClientHeader from "./ClientHeader";

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const globeLocked = !ready || !user;
  return (
    <>
      <div
        className={`fixed inset-0 z-10    
                    ${globeLocked ? "pointer-events-none opacity-40" : ""}`}
      >
        {user && <ClientHeader />}
        <YearGlobe />
      </div>
      {children}
    </>
  );
}
