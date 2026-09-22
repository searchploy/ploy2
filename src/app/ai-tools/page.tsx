import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { toolsHubContent } from "@/lib/seo/content-tools";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("toolsHub");

// Rendered per request — see the note in /ai-employees.

export default function AiToolsPage() {
  return <SeoContentPage pageKey="toolsHub" content={toolsHubContent} />;
}
