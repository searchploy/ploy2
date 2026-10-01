"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Clarity from "@microsoft/clarity";

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

// Local dev and Vercel preview deployments must not record into the live project.
const HOSTS = ["searchploy.com", "www.searchploy.com"];

// Older implicit-flow reset emails land here with the recovery session's
// tokens in the URL fragment, and Clarity records page URLs.
const NEVER_START_ON = ["/reset-password"];

/*
 * Clarity follows client-side navigations itself, so this only has to start it.
 * Clarity.init is idempotent (it skips if #clarity-script exists), which makes
 * re-running on pathname changes harmless and lets a visit that began on an
 * excluded page start recording once it moves on.
 */
export function MicrosoftClarity() {
  const pathname = usePathname();

  useEffect(() => {
    if (!PROJECT_ID || !HOSTS.includes(window.location.hostname)) return;
    if (NEVER_START_ON.includes(pathname) || /access_token|refresh_token/.test(window.location.hash)) return;
    try {
      Clarity.init(PROJECT_ID);
    } catch {}
  }, [pathname]);

  return null;
}
