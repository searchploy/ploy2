import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { dataEntryContent } from "@/lib/seo/content-problems";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("dataEntry");

// Rendered per request — see the note in /ai-employees.

export default function AiForDataEntryPage() {
  return <SeoContentPage pageKey="dataEntry" content={dataEntryContent} />;
}
