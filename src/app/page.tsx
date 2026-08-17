import { Hero } from "@/components/home/hero";
import { WhatBringsYou } from "@/components/home/what-brings-you";
import { HowItWorks } from "@/components/home/how-it-works";
import { WhyChoose } from "@/components/home/why-choose";
import { AiReportPreview } from "@/components/home/ai-report-preview";
import { MarketplacePreview } from "@/components/home/marketplace-preview";
import { CategoriesSection } from "@/components/home/categories-section";
import { ConsultantSection } from "@/components/home/consultant-section";
import { AgencySection } from "@/components/home/agency-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatBringsYou />
      <HowItWorks />
      <WhyChoose />
      <AiReportPreview />
      <MarketplacePreview />
      <CategoriesSection />
      <ConsultantSection />
      <AgencySection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
