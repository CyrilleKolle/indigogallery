"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface LoadingState {
  active: boolean;
  progress: number;
  item?: string | null;
}

const defaultState: LoadingState = { active: false, progress: 0 };

type SetLoading = (state: LoadingState) => void;

const LoadingContext = createContext<LoadingState>(defaultState);
const LoadingUpdateContext = createContext<SetLoading>(() => {});

export function useLoading() {
  return useContext(LoadingContext);
}

export function useSetLoading() {
  return useContext(LoadingUpdateContext);
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LoadingState>(defaultState);

  const set = useCallback((s: LoadingState) => setState(s), []);

  return (
    <LoadingContext.Provider value={state}>
      <LoadingUpdateContext.Provider value={set}>
        {children}
      </LoadingUpdateContext.Provider>
    </LoadingContext.Provider>
  );
}
