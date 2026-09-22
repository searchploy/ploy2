import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

/**
 * The AI-employee landing pages, defined once so metadata, the sitemap, the
 * footer nav and the cross-links between the pages all read the same list.
 * Adding a page here puts it in the sitemap and the footer automatically.
 */
export type SeoPageKey =
  | "hub"
  | "marketplace"
  | "smallBusiness"
  | "sales"
  | "marketing"
  | "customerService"
  | "recruiting";

export type SeoPage = {
  path: string;
  /** Short label for nav and cross-links. */
  label: string;
  title: string;
  description: string;
  /**
   * Category slugs from the live `categories` table whose published listings
   * belong on this page. Empty means the page links to the marketplace
   * instead of previewing a filtered set.
   */
  categorySlugs: string[];
};

export const SEO_PAGES: Record<SeoPageKey, SeoPage> = {
  hub: {
    path: "/ai-employees",
    label: "AI Employees",
    title: "AI Employees for Your Business",
    description:
      "Discover AI employees that can help with sales, marketing, customer service, recruiting, operations, and more. Find AI employees for your business with Ploy.",
    categorySlugs: [],
  },
  marketplace: {
    path: "/ai-employee-marketplace",
    label: "AI Employee Marketplace",
    title: "AI Employee Marketplace | Find AI Employees",
    description:
      "Explore an AI employee marketplace built to help businesses discover AI employees for sales, marketing, customer service, recruiting, and more.",
    categorySlugs: [],
  },
  smallBusiness: {
    path: "/ai-employees-for-small-business",
    label: "AI Employees for Small Business",
    title: "AI Employees for Small Businesses",
    description:
      "Find AI employees that can help small businesses with sales, marketing, customer service, recruiting, and everyday operations.",
    categorySlugs: ["automate-admin-work"],
  },
  sales: {
    path: "/ai-sales-employees",
    label: "AI Sales Employees",
    title: "AI Sales Employees | Automate Sales Tasks",
    description:
      "Discover AI sales employees that can help with lead generation, outreach, follow-ups, appointment setting, and other sales tasks.",
    categorySlugs: ["generate-more-leads", "increase-revenue"],
  },
  marketing: {
    path: "/ai-marketing-employees",
    label: "AI Marketing Employees",
    title: "AI Marketing Employees | AI Marketing Automation",
    description:
      "Discover AI marketing employees that can help businesses with content, social media, research, campaigns, SEO, and other marketing tasks.",
    categorySlugs: ["create-marketing-content"],
  },
  customerService: {
    path: "/ai-customer-service-employees",
    label: "AI Customer Service Employees",
    title: "AI Customer Service Employees | AI Customer Support",
    description:
      "Find AI customer service employees that can help businesses answer questions, support customers, manage requests, and automate repetitive support tasks.",
    categorySlugs: ["improve-customer-support"],
  },
  recruiting: {
    path: "/ai-recruiting-employees",
    label: "AI Recruiting Employees",
    title: "AI Recruiting Employees | AI Recruiters for Businesses",
    description:
      "Discover AI recruiting employees that can help with candidate sourcing, screening, scheduling, recruiting workflows, and other hiring tasks.",
    categorySlugs: ["improve-recruiting"],
  },
};

/** The four role pages, in the order they are cross-linked. */
export const ROLE_PAGE_KEYS: SeoPageKey[] = [
  "sales",
  "marketing",
  "customerService",
  "recruiting",
];

export const ALL_SEO_PAGES = Object.values(SEO_PAGES);

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/**
 * Metadata for one landing page. The canonical is relative — metadataBase in
 * the root layout resolves it — and robots is left at the site default so
 * these stay indexable.
 */
export function seoMetadata(key: SeoPageKey): Metadata {
  const page = SEO_PAGES[key];
  const title = `${page.title} | ${SITE_NAME}`;

  return {
    // The root layout's "%s | Ploy" template would double the suffix on the
    // titles that already carry one, so each page sets its own absolute title.
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title,
      description: page.description,
      url: page.path,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: "/ploy-wordmark.png", width: 2016, height: 780, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
    },
  };
}
