export const SITE_NAME = "Ploy";
export const SITE_DESCRIPTION =
  "Ploy is an AI tools marketplace for businesses. Generate a free AI Report to see which AI tools fit the problems you're actually trying to solve, browse the marketplace, list your own AI tool, or build an AI consulting business.";

export const NAV_LINKS = [
  { label: "AI Tools", href: "/marketplace" },
  { label: "AI Report", href: "/report" },
  { label: "For Agencies", href: "/for-agencies" },
  { label: "Consultants", href: "/consultants" },
] as const;

/**
 * The SEO landing pages are too many to list in full here, so each group shows
 * its hub plus the strongest few. The hub pages carry the complete set of
 * cross-links, which is where the internal linking depth actually lives.
 */
export const FOOTER_LINKS = {
  Product: [
    { label: "AI Report", href: "/report" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Pricing", href: "/pricing" },
  ],
  "AI Tools": [
    { label: "All AI Tools", href: "/ai-tools" },
    { label: "For Small Business", href: "/ai-tools-for-small-business" },
    { label: "For Sales", href: "/ai-tools-for-sales" },
    { label: "For Marketing", href: "/ai-tools-for-marketing" },
    { label: "For Customer Service", href: "/ai-tools-for-customer-service" },
    { label: "For Recruiting", href: "/ai-tools-for-recruiting" },
  ],
  "By Use Case": [
    { label: "Lead Generation", href: "/ai-for-lead-generation" },
    { label: "Customer Support", href: "/ai-for-customer-support" },
    { label: "Appointment Scheduling", href: "/ai-for-appointment-scheduling" },
    { label: "Sales Follow-Up", href: "/ai-for-sales-follow-up" },
    { label: "Content Creation", href: "/ai-for-content-creation" },
  ],
  "AI Employees": [
    { label: "AI Employees", href: "/ai-employees" },
    { label: "AI Employee Marketplace", href: "/ai-employee-marketplace" },
    { label: "For Small Business", href: "/ai-employees-for-small-business" },
    { label: "AI Sales Employees", href: "/ai-sales-employees" },
  ],
  Ecosystem: [
    { label: "For Consultants", href: "/consultants" },
    { label: "For Agencies", href: "/for-agencies" },
    { label: "Help Center", href: "/help" },
    { label: "API", href: "/developers" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "AI Report Disclaimer", href: "/ai-report-disclaimer" },
    { label: "Marketplace Provider Terms", href: "/marketplace-provider-terms" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

/**
 * Admin account. Lives here (not in lib/auth/admin.ts) so Client Components can
 * import it without pulling in server-only modules like next/headers.
 * Authorization itself is still enforced server-side — this is only used to
 * pick a landing route after sign-in.
 */
export const ADMIN_EMAIL = "admin@searchploy.com";

/**
 * Set once the marketplace browser has rendered in a tab, and read by a
 * listing's back link to decide whether popping history lands on the
 * marketplace or somewhere outside the site.
 */
export const MARKETPLACE_VISITED_KEY = "ploy:marketplace-visited";
