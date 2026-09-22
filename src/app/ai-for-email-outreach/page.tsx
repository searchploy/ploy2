import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { emailOutreachContent } from "@/lib/seo/content-problems";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("emailOutreach");

// Rendered per request — see the note in /ai-employees.

export default function AiForEmailOutreachPage() {
  return <SeoContentPage pageKey="emailOutreach" content={emailOutreachContent} />;
}
