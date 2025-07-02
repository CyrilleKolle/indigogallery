// src/components/SplashScreenProvider.tsx
"use client";

import { ReactNode, useState } from "react";
import SplashScreen from "./SplashScreen";

export default function SplashScreenProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [introShown, setIntroShown] = useState(false);

  const onFinish = () => {
    setIntroShown(true);
    document.cookie = "intro-shown=true; path=/";
  };
  if (!introShown) {
    return <SplashScreen onFinish={onFinish} />;
  }

  return <>{children}</>;
}
