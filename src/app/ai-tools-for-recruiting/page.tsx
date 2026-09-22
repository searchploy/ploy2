import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { toolsRecruitingContent } from "@/lib/seo/content-tools";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("toolsRecruiting");

// Rendered per request — see the note in /ai-employees.

export default function AiToolsForRecruitingPage() {
  return <SeoContentPage pageKey="toolsRecruiting" content={toolsRecruitingContent} />;
}
