/**
 * Legal document versions and the short in-product disclosures.
 *
 * Versions are dates. Bump one when the corresponding document changes in a
 * way a user should re-accept; acceptance rows are keyed by version, so a bump
 * makes every prior acceptance visibly historical rather than overwriting it.
 *
 * DOCUMENT_TYPE values must stay in sync with the legal_document_type enum in
 * migration 0027.
 */

export const LEGAL_VERSIONS = {
  terms: "2026-09-16",
  privacy: "2026-09-16",
  marketplace_provider_terms: "2026-09-16",
  ai_report_disclaimer: "2026-09-16",
} as const;

export type LegalDocumentType = keyof typeof LEGAL_VERSIONS;

export const LEGAL_ROUTES = {
  terms: "/terms",
  privacy: "/privacy",
  marketplace_provider_terms: "/marketplace-provider-terms",
  ai_report_disclaimer: "/ai-report-disclaimer",
} as const;

export const SUPPORT_EMAIL = "support@searchploy.com";
export const SITE_DOMAIN = "searchploy.com";

/**
 * Short contextual disclosures, kept here so the same wording appears
 * everywhere the thing they describe is presented. These sit next to the
 * feature itself — they are not a substitute for the full documents.
 */
export const DISCLOSURES = {
  // Each string continues the bolded lead-in its component renders ("AI-generated
  // recommendations.", "Third-party product."), so it must not repeat it.
  aiReport:
    "These recommendations are based on the information you provided and are for informational purposes. Ploy does not guarantee that a recommended AI tool or strategy will produce a particular result.",
  aiReportEstimates:
    "Estimates are based on the information provided about your business and the assumptions used by Ploy's analysis. Actual results will vary.",
  roadmap:
    "This roadmap is a planning tool generated from the information provided about your business. Timelines, costs and potential savings are estimates, not guarantees, and it is not a substitute for professional business, financial, legal, security or technical advice.",
  marketplaceListing:
    "This AI tool is provided by an independent provider. Ploy does not guarantee its performance, security, suitability, availability, accuracy, or results.",
  marketplaceBrowse:
    "AI tools on Ploy are offered by independent third-party providers. Ploy does not develop, operate, control, endorse or warrant them, and any purchase you make is directly with the provider.",
  externalLink:
    "You are leaving Ploy. Ploy does not control this website or its products, services, policies or terms.",
  ployProVisibility:
    "Eligible Ploy Pro listings may receive enhanced marketplace placement and additional exposure in AI Reports. Increased visibility does not guarantee traffic, leads, sales, conversions, or revenue.",
  marketplaceApproval:
    "Marketplace approval means the listing has been reviewed for inclusion on Ploy. It does not guarantee the provider's performance, security, results, or suitability.",
  consultantTemplate:
    "Ploy's templates are starting points for your own business, not legal, tax, or professional advice. A proposal is a commercial document, not a services agreement — you should have your own contract terms prepared or reviewed by a qualified professional in your jurisdiction, and you are responsible for what you send to your clients.",
  // Covers the decorative currency figures drifting in the consultant page
  // margins. They are ornamental, but on a page selling a paid programme a
  // reader can take them as an earnings claim, so they are disclaimed as
  // illustrative at the point of the decision.
  consultantEarnings:
    "Any currency figures shown on this page are illustrative only. They are not earnings, projections, or a representation of actual or typical results. Ploy does not guarantee that you will find clients or generate any income, and what you earn depends on your own effort, skill, market and business decisions.",
} as const;

/** Reasons a visitor can report a marketplace listing. Mirrors the listing_report_reason enum. */
export const LISTING_REPORT_REASONS = [
  { value: "misleading", label: "Misleading information" },
  { value: "fraud", label: "Fraud or scam concern" },
  { value: "does_not_exist", label: "Product doesn't appear to exist" },
  { value: "pricing", label: "Incorrect pricing" },
  { value: "misrepresentation", label: "Misrepresents a company or product" },
  { value: "security", label: "Security or privacy concern" },
  { value: "other", label: "Something else" },
] as const;

export type ListingReportReason = (typeof LISTING_REPORT_REASONS)[number]["value"];
