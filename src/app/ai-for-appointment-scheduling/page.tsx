import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/seo-content-page";
import { appointmentSchedulingContent } from "@/lib/seo/content-problems";
import { seoMetadata } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("appointmentScheduling");

// Rendered per request — see the note in /ai-employees.

export default function AiForAppointmentSchedulingPage() {
  return <SeoContentPage pageKey="appointmentScheduling" content={appointmentSchedulingContent} />;
}
