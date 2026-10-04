import { normaliseUrl } from "@/lib/listing/options";

export type AccessMethod = "website" | "app_store" | "google_play";

export const ACCESS_METHODS: AccessMethod[] = ["website", "app_store", "google_play"];

type ListingUrls = {
  website_url: string | null;
  app_store_url?: string | null;
  google_play_url?: string | null;
};

export const ACCESS_METHOD_LABELS: Record<AccessMethod, string> = {
  website: "Website",
  app_store: "Apple App Store",
  google_play: "Google Play",
};

// Mirrors the employees_*_url_valid constraints (migration 0033), which are the
// real enforcement — these only catch mistakes before the round trip.
const STORE_HOSTS: Record<Exclude<AccessMethod, "website">, string[]> = {
  app_store: ["apps.apple.com", "itunes.apple.com"],
  google_play: ["play.google.com"],
};

/**
 * Trims, assumes https:// when no scheme is typed, upgrades http:// to https://
 * and accepts only the store's own hosts. Any other scheme (javascript:, data:)
 * ends up with an unparseable or foreign host and is rejected.
 */
function normaliseStoreUrl(value: string, method: Exclude<AccessMethod, "website">): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed.replace(/^http:\/\//i, "https://")
    : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "https:" || !STORE_HOSTS[method].includes(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function normaliseAccessUrl(method: AccessMethod, value: string): string | null {
  return method === "website" ? normaliseUrl(value) : normaliseStoreUrl(value, method);
}

export const ACCESS_URL_ERRORS: Record<AccessMethod, string> = {
  website: "That website URL doesn't look valid.",
  app_store: "That doesn't look like an Apple App Store link (it should start with https://apps.apple.com/).",
  google_play: "That doesn't look like a Google Play link (it should start with https://play.google.com/).",
};

export type AccessLink = { method: AccessMethod; url: string };

/** The listing's access links in display order, skipping methods it doesn't offer. */
export function getAccessLinks(listing: ListingUrls): AccessLink[] {
  const links: AccessLink[] = [];
  if (listing.website_url) links.push({ method: "website", url: listing.website_url });
  if (listing.app_store_url) links.push({ method: "app_store", url: listing.app_store_url });
  if (listing.google_play_url) links.push({ method: "google_play", url: listing.google_play_url });
  return links;
}
