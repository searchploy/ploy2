import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { socialMediaContent } from "@/lib/seo/content-problems";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("socialMedia");

// Rendered per request — see the note in /ai-employees.

export default function AiForSocialMediaPage() {
  return <SeoContentPage pageKey="socialMedia" content={socialMediaContent} />;
}
