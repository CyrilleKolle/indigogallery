"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";

type AuthState = {
  user: User | null;
  ready: boolean;
  sessionReady: boolean;
  markSessionReady: () => void;
};

const AuthCtx = createContext<AuthState>({
  user: null,
  ready: false,
  sessionReady: false,
  markSessionReady: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPersistence(clientAuth, browserLocalPersistence)
      .catch((e) => console.error("setPersistence failed:", e))
      .finally(() => {
        const unsub = onAuthStateChanged(clientAuth, (u) => {
          setUser(u);
          setReady(true);
        });
        return unsub;
      });
  }, []);
  const markSessionReady = () => {
    setSessionReady(true);
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        ready,
        sessionReady,
        markSessionReady,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
