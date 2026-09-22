import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { toolsSalesContent } from "@/lib/seo/content-tools";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("toolsSales");

// Rendered per request — see the note in /ai-employees.

export default function AiToolsForSalesPage() {
  return <SeoContentPage pageKey="toolsSales" content={toolsSalesContent} />;
}
