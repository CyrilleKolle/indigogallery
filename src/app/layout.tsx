import type { Metadata } from "next";
import "./globals.css";

import { BodyWrapper } from "./root-styling";
import { SplashScreenProvider } from "@/components/SplashScreenProvider";

import ClientRoot from "@/components/ClientRoot";
import AuthProvider from "@/components/AuthProvider";
import UnauthOverlay from "@/components/UnauthOverlay";
import { LoadingProvider } from "@/contexts/LoadingContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import RouteGuard from "@/components/RouteGuard";

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
      <LoadingProvider>
        <SplashScreenProvider>
          <AuthProvider>
            <RouteGuard />
            <LoadingOverlay />
            <UnauthOverlay />
            <ClientRoot>{children}</ClientRoot>
          </AuthProvider>
        </SplashScreenProvider>
      </LoadingProvider>
    </BodyWrapper>
  );
}
