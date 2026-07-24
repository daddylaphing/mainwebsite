"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Detects Supabase auth error fragments in the URL (e.g. after an expired reset link)
 * and redirects the user appropriately instead of silently staying on the homepage.
 */
export function AuthErrorHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const error = params.get("error");
    const errorCode = params.get("error_code");
    const errorDesc = params.get("error_description");

    if (!error) return;

    // Clear the hash from the URL cleanly
    window.history.replaceState(null, "", window.location.pathname + window.location.search);

    if (errorCode === "otp_expired" || error === "access_denied") {
      toast.error("Reset link expired. Please request a new one.");
      router.push("/forgot-password");
    } else {
      toast.error(errorDesc?.replace(/\+/g, " ") || "Authentication error. Please try again.");
      router.push("/login");
    }
  }, [router]);

  return null;
}
