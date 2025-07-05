"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";
import React from "react";

export default function ClientHeader() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(clientAuth);
    router.replace("/login");
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        onClick={handleSignOut}
        className="group inline-flex items-center gap-2 text-lg text-white md:text-2xl tracking-wide uppercase transition-colors duration-150 hover:text-indigo-300"
      >
        <span className="transform inline-block origin-center transition-transform duration-200 group-hover:scale-125">
          [
        </span>
        <span className="transform inline-block transition-transform duration-200 group-hover:scale-90">
          sign out
        </span>
        <span className="transform inline-block origin-center transition-transform duration-200 group-hover:scale-125">
          ]
        </span>
      </button>
    </div>
  );
}
