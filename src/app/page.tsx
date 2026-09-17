import { Hero } from "@/components/home/hero";
import { WhatBringsYou } from "@/components/home/what-brings-you";
import { HowItWorks } from "@/components/home/how-it-works";
import { WhyChoose } from "@/components/home/why-choose";
import { AiReportPreview } from "@/components/home/ai-report-preview";
import { MarketplacePreview } from "@/components/home/marketplace-preview";
import { CategoriesSection } from "@/components/home/categories-section";
import { ConsultantSection } from "@/components/home/consultant-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";

/*
 * .section-drift lifts each section against the fixed plane behind it as it
 * crosses the viewport. It is a scroll timeline in CSS, so this stays a server
 * component and the page ships no scroll handlers. Hero is left alone — it runs
 * its own two-plane version.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="section-drift">
        <WhatBringsYou />
      </div>
      <div className="section-drift">
        <HowItWorks />
      </div>
      <div className="section-drift">
        <WhyChoose />
      </div>
      <div className="section-drift">
        <AiReportPreview />
      </div>
      <div className="section-drift">
        <MarketplacePreview />
      </div>
      <div className="section-drift">
        <CategoriesSection />
      </div>
      <div className="section-drift">
        <ConsultantSection />
      </div>
      <div className="section-drift">
        <TestimonialsSection />
      </div>
      <div className="section-drift">
        <CtaSection />
      </div>
    </>
  );
}
