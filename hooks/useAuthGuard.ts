/**
 * useAuthGuard — Auth gate hook for client components.
 *
 * Returns a `requireAuth` function. Call it before any action that needs
 * the user to be logged in. If they are not, it redirects them to the
 * login page with `callbackUrl` set so they return after signing in.
 *
 * Usage:
 *   const requireAuth = useAuthGuard();
 *   function handleClick() {
 *     if (!requireAuth()) return;   // redirects if not logged in
 *     // ...do authenticated action
 *   }
 */
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export function useAuthGuard() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Returns `true` if the user is authenticated.
   * Returns `false` and redirects to /login if they are not.
   * Returns `true` optimistically while loading (session is still fetching)
   * so clicks don't feel sluggish on initial load.
   */
  function requireAuth(): boolean {
    if (status === "loading") return false; // wait — don't act yet
    if (status === "authenticated") return true;

    // Not authenticated — send them to login with a callback
    const callbackUrl = encodeURIComponent(pathname);
    router.push(`/login?callbackUrl=${callbackUrl}`);
    return false;
  }

  return requireAuth;
}
