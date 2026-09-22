import type { MetadataRoute } from "next";
import { getLivePublishedEmployees } from "@/lib/data/live-marketplace";
import { ALL_SEO_PAGES, siteUrl } from "@/lib/seo/pages";

/**
 * Public pages only. Anything behind auth — dashboards, account, the listing
 * editor — is deliberately absent, along with the auth routes themselves.
 */
const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/marketplace", priority: 0.9, changeFrequency: "daily" },
  { path: "/report", priority: 0.8, changeFrequency: "monthly" },
  { path: "/for-agencies", priority: 0.7, changeFrequency: "monthly" },
  { path: "/consultants", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/agencies", priority: 0.6, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/help", priority: 0.5, changeFrequency: "monthly" },
  { path: "/developers", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/ai-report-disclaimer", priority: 0.2, changeFrequency: "yearly" },
  { path: "/marketplace-provider-terms", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticEntries = STATIC_PATHS.map((entry) => ({
    url: `${base}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const seoEntries = ALL_SEO_PAGES.map((page) => ({
    url: `${base}${page.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Listing pages are the long tail worth indexing. A failure here must not
  // take the whole sitemap down, so the static entries still ship on error.
  let listingEntries: MetadataRoute.Sitemap = [];
  try {
    const employees = await getLivePublishedEmployees();
    listingEntries = employees.map((employee) => ({
      url: `${base}/marketplace/${employee.slug}`,
      lastModified: employee.updated_at ? new Date(employee.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    listingEntries = [];
  }

  return [...staticEntries, ...seoEntries, ...listingEntries];
}
