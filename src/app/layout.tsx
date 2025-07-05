import type { Metadata } from "next";
import "./globals.css";

import { BodyWrapper } from "./root-styling";
import SplashScreenProvider from "@/components/SplashScreenProvider";

import ClientRoot from "@/components/ClientRoot";
import AuthProvider from "@/components/AuthProvider";
import UnauthOverlay from "@/components/UnauthOverlay";

export const metadata: Metadata = {
  title: "Indigo Photo Space Gallery",
  description: "A space for sharing and exploring photography",
};

/* * This is the root layout for the application.
 * It wraps the entire app in necessary providers and styles.
 * It also handles the splash screen and authentication state.
 * It is used in the app directory structure.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BodyWrapper>
      <SplashScreenProvider>
        <AuthProvider>
          <ClientRoot>{children}</ClientRoot>
          <UnauthOverlay />
        </AuthProvider>
      </SplashScreenProvider>
    </BodyWrapper>
  );
}
