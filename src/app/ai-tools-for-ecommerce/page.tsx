import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { toolsEcommerceContent } from "@/lib/seo/content-tools";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("toolsEcommerce");

// Rendered per request — see the note in /ai-employees.

export default function AiToolsForEcommercePage() {
  return <SeoContentPage pageKey="toolsEcommerce" content={toolsEcommerceContent} />;
}
