import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { salesFollowUpContent } from "@/lib/seo/content-problems";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("salesFollowUp");

// Rendered per request — see the note in /ai-employees.

export default function AiForSalesFollowUpPage() {
  return <SeoContentPage pageKey="salesFollowUp" content={salesFollowUpContent} />;
}
