"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    void fetch("/api/analytics/track", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => {
      // Ignore tracking errors so UX is never blocked by analytics.
    });
  }, [pathname]);

  return null;
}
