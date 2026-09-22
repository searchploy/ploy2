import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { toolsSmallBusinessContent } from "@/lib/seo/content-tools";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("toolsSmallBusiness");

// Rendered per request — see the note in /ai-employees.

export default function AiToolsForSmallBusinessPage() {
  return <SeoContentPage pageKey="toolsSmallBusiness" content={toolsSmallBusinessContent} />;
}
