import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * Deliberately no script/connect CSP: Stripe injects its own frames and
 * scripts, Supabase is called from the browser, and Next.js uses inline
 * bootstrap script. A blocking policy covering those needs nonce plumbing and
 * would break checkout if any source were missed. frame-ancestors is the one
 * CSP directive that is both safe here and not expressible any other way, so
 * it is used on its own for clickjacking protection.
 */
const securityHeaders = [
  // Nothing may frame the site — protects the dashboards and checkout from
  // clickjacking. Supersedes X-Frame-Options in modern browsers; both are set
  // so older ones are covered too.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers guessing a content type — the defence against an uploaded
  // file being sniffed as something executable.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full report or dashboard URLs (they contain ids) to third
  // parties via the Referer header.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs these devices; Stripe payment sheets are unaffected.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Two years, including subdomains. Vercel already serves HTTPS only.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/**
 * Alias URLs that people guess or link to, pointed at the page that actually
 * owns the intent. These are variants deliberately *not* built as their own
 * pages — a separate /ai-for-recruiting would compete with
 * /ai-tools-for-recruiting for the same result rather than adding anything.
 *
 * No existing URL is redirected away: the /ai-employee* pages target their own
 * keywords and keep earning, so they stay live.
 */
const seoAliases: { source: string; destination: string }[] = [
  { source: "/ai-tools-marketplace", destination: "/ai-tools" },
  { source: "/ai-tool-marketplace", destination: "/ai-tools" },
  { source: "/best-ai-tools", destination: "/ai-tools" },
  { source: "/ai-tools-for-business", destination: "/ai-tools" },
  { source: "/ai-tools-for-businesses", destination: "/ai-tools" },
  { source: "/ai-tools-for-customer-support", destination: "/ai-tools-for-customer-service" },
  { source: "/ai-for-sales", destination: "/ai-tools-for-sales" },
  { source: "/ai-for-marketing", destination: "/ai-tools-for-marketing" },
  { source: "/ai-for-recruiting", destination: "/ai-tools-for-recruiting" },
  { source: "/ai-for-customer-service", destination: "/ai-for-customer-support" },
  { source: "/ai-for-reporting", destination: "/ai-for-data-entry" },
  { source: "/ai-for-research", destination: "/ai-for-content-creation" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return seoAliases.map((alias) => ({ ...alias, permanent: true }));
  },
};

export default nextConfig;
