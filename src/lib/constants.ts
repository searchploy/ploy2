export const SITE_NAME = "Ploy";
export const SITE_DESCRIPTION =
  "Ploy is the AI Adoption Platform — the operating system for how businesses discover, evaluate, implement, and manage AI. Generate a free AI Workforce Report, hire AI employees from the marketplace, build an AI consulting business, or get customers for the AI employees you've built.";

export const NAV_LINKS = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "AI Report", href: "/report" },
  { label: "For Agencies", href: "/for-agencies" },
  { label: "Consultants", href: "/consultants" },
] as const;

export const FOOTER_LINKS = {
  Product: [
    { label: "AI Report", href: "/report" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Pricing", href: "/pricing" },
  ],
  Ecosystem: [
    { label: "For Consultants", href: "/consultants" },
    { label: "For Agencies", href: "/for-agencies" },
    { label: "Help Center", href: "/help" },
    { label: "API", href: "/developers" },
  ],
  Company: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const COMMISSION_PCT = 15;

/**
 * Admin account. Lives here (not in lib/auth/admin.ts) so Client Components can
 * import it without pulling in server-only modules like next/headers.
 * Authorization itself is still enforced server-side — this is only used to
 * pick a landing route after sign-in.
 */
export const ADMIN_EMAIL = "admin@searchploy.com";
