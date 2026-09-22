import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

/**
 * The SEO landing pages, defined once so metadata, the sitemap, the footer nav
 * and the cross-links between pages all read the same list. Adding a page here
 * puts it in the sitemap and the footer automatically.
 *
 * Three search-intent groups, kept apart so they do not cannibalise each other:
 *
 *   employee — "AI employee" queries. An AI employee is one kind of AI tool,
 *              and these pages say so while still owning the keyword.
 *   tool     — "AI tools for X" queries. Product-category roundups.
 *   problem  — "AI for X" queries. Written around the workflow being fixed
 *              rather than the product category, and the main feeder into the
 *              AI Report.
 */
export type SeoGroup = "employee" | "tool" | "problem";

export type SeoPageKey =
  // Group A — AI employee keywords.
  | "hub"
  | "marketplace"
  | "smallBusiness"
  | "sales"
  | "marketing"
  | "customerService"
  | "recruiting"
  // Group B — AI tool keywords.
  | "toolsHub"
  | "toolsSmallBusiness"
  | "toolsSales"
  | "toolsMarketing"
  | "toolsCustomerService"
  | "toolsRecruiting"
  | "toolsRealEstate"
  | "toolsEcommerce"
  // Group C — problem and use-case keywords.
  | "leadGeneration"
  | "customerSupport"
  | "appointmentScheduling"
  | "salesFollowUp"
  | "socialMedia"
  | "contentCreation"
  | "dataEntry"
  | "emailOutreach";

export type SeoPage = {
  path: string;
  /** Short label for nav and cross-links. */
  label: string;
  title: string;
  description: string;
  group: SeoGroup;
  /**
   * Category slugs from the live `categories` table whose published listings
   * belong on this page. Empty means the page links to the marketplace
   * instead of previewing a filtered set.
   */
  categorySlugs: string[];
};

export const SEO_PAGES: Record<SeoPageKey, SeoPage> = {
  // ---------------------------------------------------------------------
  // Group A — AI employee keywords.
  // ---------------------------------------------------------------------
  hub: {
    path: "/ai-employees",
    label: "AI Employees",
    title: "AI Employees for Your Business",
    description:
      "AI employees are AI tools built to run an ongoing role rather than a single task. See what they do across sales, marketing, support and recruiting, and how they compare to other AI tools.",
    group: "employee",
    categorySlugs: [],
  },
  marketplace: {
    path: "/ai-employee-marketplace",
    label: "AI Employee Marketplace",
    title: "AI Employee Marketplace | Find AI Employees",
    description:
      "Browse an AI employee marketplace built for businesses. Compare AI employees alongside the wider catalogue of AI tools on Ploy, filtered by the problem you are solving.",
    group: "employee",
    categorySlugs: [],
  },
  smallBusiness: {
    path: "/ai-employees-for-small-business",
    label: "AI Employees for Small Business",
    title: "AI Employees for Small Businesses",
    description:
      "How small businesses use AI employees — and when a simpler AI tool is the better fit. Covers sales, support, admin and the costs to plan for.",
    group: "employee",
    categorySlugs: ["automate-admin-work"],
  },
  sales: {
    path: "/ai-sales-employees",
    label: "AI Sales Employees",
    title: "AI Sales Employees | Automate Sales Tasks",
    description:
      "AI sales employees handle lead generation, outreach, follow-up and appointment setting. See what they cover, where a person still belongs, and how to choose one.",
    group: "employee",
    categorySlugs: ["generate-more-leads", "increase-revenue"],
  },
  marketing: {
    path: "/ai-marketing-employees",
    label: "AI Marketing Employees",
    title: "AI Marketing Employees | AI Marketing Automation",
    description:
      "AI marketing employees take on content drafting, social scheduling, SEO research and campaign reporting. See what they do and what to check before choosing one.",
    group: "employee",
    categorySlugs: ["create-marketing-content"],
  },
  customerService: {
    path: "/ai-customer-service-employees",
    label: "AI Customer Service Employees",
    title: "AI Customer Service Employees | AI Customer Support",
    description:
      "AI customer service employees answer repeat questions, triage tickets and cover out-of-hours support. See how escalation should work and what to ask a provider.",
    group: "employee",
    categorySlugs: ["improve-customer-support"],
  },
  recruiting: {
    path: "/ai-recruiting-employees",
    label: "AI Recruiting Employees",
    title: "AI Recruiting Employees | AI Recruiters for Businesses",
    description:
      "AI recruiting employees handle sourcing, screening support, scheduling and candidate communication — with hiring decisions left to people. See what to check first.",
    group: "employee",
    categorySlugs: ["improve-recruiting"],
  },

  // ---------------------------------------------------------------------
  // Group B — AI tool keywords.
  // ---------------------------------------------------------------------
  toolsHub: {
    path: "/ai-tools",
    label: "AI Tools",
    title: "AI Tools for Business | Find the Right AI Tool",
    description:
      "Find AI tools for your business, grouped by the problem they solve rather than the technology behind them. Compare AI tools for sales, marketing, support, recruiting and admin.",
    group: "tool",
    categorySlugs: [],
  },
  toolsSmallBusiness: {
    path: "/ai-tools-for-small-business",
    label: "AI Tools for Small Business",
    title: "AI Tools for Small Business",
    description:
      "AI tools that fit a small business — where they save real time, what they cost to run, and how to pick a first one without committing to a large rollout.",
    group: "tool",
    categorySlugs: ["automate-admin-work"],
  },
  toolsSales: {
    path: "/ai-tools-for-sales",
    label: "AI Tools for Sales",
    title: "AI Tools for Sales Teams",
    description:
      "AI tools for sales teams, from lead research and outreach to follow-up, scheduling and CRM upkeep. See which parts of a sales process they fit and how to compare them.",
    group: "tool",
    categorySlugs: ["generate-more-leads", "increase-revenue"],
  },
  toolsMarketing: {
    path: "/ai-tools-for-marketing",
    label: "AI Tools for Marketing",
    title: "AI Tools for Marketing Teams",
    description:
      "AI tools for marketing — content drafting, social scheduling, SEO and competitor research, and campaign reporting. What they do well and where review still matters.",
    group: "tool",
    categorySlugs: ["create-marketing-content"],
  },
  toolsCustomerService: {
    path: "/ai-tools-for-customer-service",
    label: "AI Tools for Customer Service",
    title: "AI Tools for Customer Service",
    description:
      "AI tools for customer service teams — answering repeat questions, triaging tickets, routing conversations and covering the hours you cannot staff.",
    group: "tool",
    categorySlugs: ["improve-customer-support"],
  },
  toolsRecruiting: {
    path: "/ai-tools-for-recruiting",
    label: "AI Tools for Recruiting",
    title: "AI Tools for Recruiting and Hiring",
    description:
      "AI tools for recruiting — sourcing, screening support, interview scheduling and candidate communication, plus the legal and oversight questions to settle first.",
    group: "tool",
    categorySlugs: ["improve-recruiting"],
  },
  toolsRealEstate: {
    path: "/ai-tools-for-real-estate",
    label: "AI Tools for Real Estate",
    title: "AI Tools for Real Estate Agents and Brokerages",
    description:
      "AI tools for real estate — lead response, listing copy, viewing coordination and pipeline follow-up. Where they fit in an agent's week and what to check before buying.",
    group: "tool",
    categorySlugs: ["generate-more-leads", "automate-admin-work"],
  },
  toolsEcommerce: {
    path: "/ai-tools-for-ecommerce",
    label: "AI Tools for Ecommerce",
    title: "AI Tools for Ecommerce Businesses",
    description:
      "AI tools for ecommerce — product descriptions, order and returns support, post-purchase messaging and merchandising analysis. What they handle and what they do not.",
    group: "tool",
    categorySlugs: ["improve-customer-support", "create-marketing-content"],
  },

  // ---------------------------------------------------------------------
  // Group C — problem and use-case keywords.
  // ---------------------------------------------------------------------
  leadGeneration: {
    path: "/ai-for-lead-generation",
    label: "AI for Lead Generation",
    title: "AI for Lead Generation | Automate Finding Leads",
    description:
      "How AI is used for lead generation — building target lists, enriching records, qualifying inbound enquiries and routing the ones worth a call. Plus what it cannot fix.",
    group: "problem",
    categorySlugs: ["generate-more-leads"],
  },
  customerSupport: {
    path: "/ai-for-customer-support",
    label: "AI for Customer Support",
    title: "AI for Customer Support | Reduce Response Times",
    description:
      "How AI is used in customer support to cut first-response times and clear repeat questions — where deflection helps, where it backfires, and how to measure it honestly.",
    group: "problem",
    categorySlugs: ["improve-customer-support"],
  },
  appointmentScheduling: {
    path: "/ai-for-appointment-scheduling",
    label: "AI for Appointment Scheduling",
    title: "AI for Appointment Scheduling and Booking",
    description:
      "How AI handles appointment scheduling — offering times, booking across calendars, sending reminders and rebooking no-shows. One of the lowest-risk places to start.",
    group: "problem",
    categorySlugs: ["automate-admin-work"],
  },
  salesFollowUp: {
    path: "/ai-for-sales-follow-up",
    label: "AI for Sales Follow-Up",
    title: "AI for Sales Follow-Up | Stop Losing Warm Deals",
    description:
      "Most deals go quiet because nobody circled back. How AI keeps follow-up consistent across a pipeline, and where a salesperson still has to take the thread over.",
    group: "problem",
    categorySlugs: ["generate-more-leads", "increase-revenue"],
  },
  socialMedia: {
    path: "/ai-for-social-media",
    label: "AI for Social Media",
    title: "AI for Social Media Management",
    description:
      "How AI is used for social media — repurposing one idea across channels, keeping a schedule filled and drafting replies. Plus why approval before publishing matters.",
    group: "problem",
    categorySlugs: ["create-marketing-content"],
  },
  contentCreation: {
    path: "/ai-for-content-creation",
    label: "AI for Content Creation",
    title: "AI for Content Creation | Drafting at Scale",
    description:
      "How AI is used for content creation — outlines, first drafts, repurposing and briefs. What a draft is genuinely worth, and the editing pass that has to stay human.",
    group: "problem",
    categorySlugs: ["create-marketing-content"],
  },
  dataEntry: {
    path: "/ai-for-data-entry",
    label: "AI for Data Entry",
    title: "AI for Data Entry and Admin Work",
    description:
      "How AI handles data entry — reading documents, moving information between systems and keeping records current. Where accuracy checks still belong in the process.",
    group: "problem",
    categorySlugs: ["automate-admin-work"],
  },
  emailOutreach: {
    path: "/ai-for-email-outreach",
    label: "AI for Email Outreach",
    title: "AI for Email Outreach | Personalised Sending at Scale",
    description:
      "How AI is used for email outreach — drafting, personalising and sequencing. Plus the deliverability and compliance limits that decide whether it works at all.",
    group: "problem",
    categorySlugs: ["generate-more-leads"],
  },
};

/** The four AI-employee role pages, in the order they are cross-linked. */
export const ROLE_PAGE_KEYS: SeoPageKey[] = [
  "sales",
  "marketing",
  "customerService",
  "recruiting",
];

export const ALL_SEO_PAGES = Object.values(SEO_PAGES);

export function pagesInGroup(group: SeoGroup): SeoPage[] {
  return ALL_SEO_PAGES.filter((page) => page.group === group);
}

export function keysInGroup(group: SeoGroup): SeoPageKey[] {
  return (Object.keys(SEO_PAGES) as SeoPageKey[]).filter(
    (key) => SEO_PAGES[key].group === group
  );
}

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
