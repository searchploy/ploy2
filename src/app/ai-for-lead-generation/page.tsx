import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { leadGenerationContent } from "@/lib/seo/content-problems";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("leadGeneration");

// Rendered per request — see the note in /ai-employees.

export default function AiForLeadGenerationPage() {
  return <SeoContentPage pageKey="leadGeneration" content={leadGenerationContent} />;
}
