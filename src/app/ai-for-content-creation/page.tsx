import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { contentCreationContent } from "@/lib/seo/content-problems";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("contentCreation");

// Rendered per request — see the note in /ai-employees.

export default function AiForContentCreationPage() {
  return <SeoContentPage pageKey="contentCreation" content={contentCreationContent} />;
}
