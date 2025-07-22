"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingOverlay } from "@/src/components/LoadingScreen";

/**
 * PageLoader shows a full-screen semi-transparent overlay with a spinner
 * whenever Next.js starts a route change (page navigation) and hides it
 * once the navigation is complete or errored.
 */
export default function PageLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  return (
    <LoadingOverlay
      isLoading={loading}
      text="Navigating..."
      variant="casino"
    />
  );
}
