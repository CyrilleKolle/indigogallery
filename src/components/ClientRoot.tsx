"use client";

import { YearGlobe } from "@/components/YearWheel";
import { useAuth } from "./AuthProvider";
import ClientHeader from "./ClientHeader";
import clsx from "clsx";
import { cn } from "@/utilities";
import { usePathname } from "next/navigation";

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const globeLocked = !ready || !user;
  const pathname = usePathname();
  const pages = pathname.startsWith("/(protected)") || pathname.startsWith("/upload") || pathname.startsWith("/year/");
  return (
    <div className={CONTAINER}>
      <div className={cn(GLOBE_STYLE, globeLocked && GLOBE_LOCKED_STYLE)}>
        <YearGlobe interactionsEnabled={!pages}/>
      </div>
      {user && (
        <header className={HEADER_STYLE} style={{ height: HEADER_HEIGHT }}>
          <ClientHeader />
        </header>
      )}
      <main
        id="main-content"
        className={MAIN_STYLE}
        style={{ top: HEADER_TOP_STYLE, bottom: HEADER_BOTTOM_STYLE }}
        role="main"
        aria-label="Main content"
        data-testid="main-content"
        data-header-top={HEADER_TOP_STYLE}
        data-header-bottom={HEADER_BOTTOM_STYLE}
        data-header-height={HEADER_HEIGHT}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </main>
    </div>
  );
}

const CONTAINER = clsx("relative h-dvh w-screen");

const GLOBE_STYLE = clsx(
  "fixed bottom-0 left-0 right-0 pointer-events-none inset-0 z-10"
);
const GLOBE_LOCKED_STYLE = clsx("opacity-40");
const HEADER_STYLE = clsx(
  "bg-transparent",
  "fixed inset-x-0 top-0 z-90 w-full pt-[env(safe-area-inset-top)]"
);
const MAIN_STYLE = clsx(
  "absolute inset-x-0 bottom-0 overflow-y-auto overscroll-contain flex flex-col",
);

const HEADER_TOP_STYLE =
  "calc(var(--app-header-h) + var(--app-header-gap) + env(safe-area-inset-top))";
const HEADER_BOTTOM_STYLE =
  "calc(var(--app-bottom-gap) + env(safe-area-inset-bottom))";

const HEADER_HEIGHT = "calc(var(--app-header-h) + env(safe-area-inset-top))";
