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
};

export default nextConfig;
