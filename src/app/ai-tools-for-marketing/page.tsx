import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { toolsMarketingContent } from "@/lib/seo/content-tools";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("toolsMarketing");

// Rendered per request — see the note in /ai-employees.

export default function AiToolsForMarketingPage() {
  return <SeoContentPage pageKey="toolsMarketing" content={toolsMarketingContent} />;
}
