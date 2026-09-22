import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { toolsCustomerServiceContent } from "@/lib/seo/content-tools";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("toolsCustomerService");

// Rendered per request — see the note in /ai-employees.

export default function AiToolsForCustomerServicePage() {
  return <SeoContentPage pageKey="toolsCustomerService" content={toolsCustomerServiceContent} />;
}
