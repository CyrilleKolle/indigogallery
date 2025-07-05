"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";

type AuthState = { user: User | null; ready: boolean };

const AuthCtx = createContext<AuthState>({ user: null, ready: false });

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AuthState>({ user: null, ready: false });

  useEffect(
    () =>
      onAuthStateChanged(clientAuth, (u) =>
        setState({ user: u, ready: true }),
      ),
    [],
  );

  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
