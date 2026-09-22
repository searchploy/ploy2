import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { customerSupportContent } from "@/lib/seo/content-problems";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("customerSupport");

// Rendered per request — see the note in /ai-employees.

export default function AiForCustomerSupportPage() {
  return <SeoContentPage pageKey="customerSupport" content={customerSupportContent} />;
}
