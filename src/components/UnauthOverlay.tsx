"use client";

import { useAuth } from "./AuthProvider";

/**
 * UnauthOverlay component renders a full-screen overlay when the user is not authenticated.
 * It is used to block interactions with the app until the user logs in.
 */
export default function UnauthOverlay() {
  const { user, ready } = useAuth();
  if (!ready) return null;

  if (user) return null;

  return (
    <div
      className="
        fixed inset-0 z-20 bg-transparent backdrop-blur-xs
        flex items-center justify-center
        pointer-events-auto"
    ></div>
  );
}
