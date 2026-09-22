import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { toolsRealEstateContent } from "@/lib/seo/content-tools";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("toolsRealEstate");

// Rendered per request — see the note in /ai-employees.

export default function AiToolsForRealEstatePage() {
  return <SeoContentPage pageKey="toolsRealEstate" content={toolsRealEstateContent} />;
}
