import type { Crumb } from "@/components/seo/breadcrumbs";
import type { SeoPageKey } from "@/lib/seo/pages";

/**
 * The shape a landing page's writing takes. SeoContentPage renders it, so a
 * new page is a content object plus a thin route file.
 */

export type SeoContentSection = {
  id: string;
  title: string;
  /** Paragraphs rendered above the section body. */
  lead?: string[];
  /** A closing paragraph under the body. */
  footnote?: string;
} & (
  | { kind: "prose"; items?: never }
  | { kind: "tasks"; items: { title: string; body: string }[] }
  | { kind: "steps"; items: { title: string; body: string }[] }
  | { kind: "checks"; items: string[] }
);

export type SeoContent = {
  eyebrow: string;
  /** The page's single h1. */
  heading: string;
  intro: string;
  trail: Crumb[];
  cta: { label: string; href: string };
  sections: SeoContentSection[];
  faqs?: { question: string; answer: string }[];
  /** Omit on pages with no meaningful category to preview. */
  listing?: {
    title: string;
    emptyBody: string;
    browseHref: string;
    browseLabel: string;
  };
  related: { keys: SeoPageKey[]; blurbs: Partial<Record<SeoPageKey, string>> };
  closing: {
    title: string;
    body: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
};
