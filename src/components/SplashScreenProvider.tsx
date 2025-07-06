"use client";

import React, { ReactNode, createContext, useContext, useState } from "react";
import SplashScreen from "./SplashScreen";

interface SplashContextValue {
  splashFinished: boolean;
}
const SplashContext = createContext<SplashContextValue>({ splashFinished: false });

/**
 * Hook to read splash state
 */
export function useSplash() {
  return useContext(SplashContext);
}

interface SplashProviderProps {
  children: ReactNode;
}

/**
 * Provider that shows the splash screen once,
 * then exposes `splashFinished` via context.
 */
export function SplashScreenProvider({ children }: SplashProviderProps) {
  const [splashFinished, setSplashFinished] = useState(false);

  // On mount, check cookie to see if intro was already shown
  // This is commented out to avoid cookie usage, but can be enabled if needed
  // useEffect(() => {
  //   const introCookie = document.cookie
  //     .split(";")
  //     .map((c) => c.trim())
  //     .find((c) => c.startsWith("intro-shown="));
  //   if (introCookie === "intro-shown=true") {
  //     setSplashFinished(true);
  //   }
  // }, []);

  const onFinish = () => {
    setSplashFinished(true);
  };

  if (!splashFinished) {
    return <SplashScreen onFinish={onFinish} />;
  }

  return (
    <SplashContext.Provider value={{ splashFinished }}>
      {children}
    </SplashContext.Provider>
  );
}
