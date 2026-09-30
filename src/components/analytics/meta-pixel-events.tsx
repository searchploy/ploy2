"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackMetaEvent, trackMetaPageView } from "@/lib/analytics/meta-pixel";

export function MetaPixelPageViews() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // The first path's PageView is sent by the base code; tracking it here too
    // would double every landing. The equality check also absorbs Strict Mode's
    // repeated mount effect in development.
    if (lastPath.current === null) {
      lastPath.current = pathname;
      return;
    }
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackMetaPageView();
  }, [pathname]);

  return null;
}

export function MetaViewContent({ contentName }: { contentName: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackMetaEvent("ViewContent", { content_name: contentName });
  }, [contentName]);

  return null;
}
