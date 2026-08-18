/** Shared option sets for the marketplace listing form and its preview. */

export const MAX_PRIMARY_TASKS = 5;
export const MAX_DESCRIPTION = 500;
export const MAX_TAGLINE = 120;

export const PRIMARY_TASKS = [
  "Lead generation",
  "Lead qualification",
  "Appointment scheduling",
  "Customer support",
  "Email outreach",
  "Social media management",
  "Content creation",
  "Recruiting",
  "Data entry",
  "Research",
  "Reporting",
  "Follow-ups",
] as const;

export const BEST_FOR = [
  "Small businesses",
  "Startups",
  "Agencies",
  "E-commerce businesses",
  "Real estate companies",
  "SaaS companies",
  "Local businesses",
  "Enterprise",
] as const;

/** "AI Sales Representative" -> "ai-sales-representative" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Accepts bare domains; returns a normalised https URL, or null if unusable. */
export function normaliseUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}
