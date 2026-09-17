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
import { ParallaxSection } from "@/components/shared/parallax-section";

/*
 * Each section drifts against the fixed plane behind it as it crosses the
 * viewport. Hero is left alone — it runs its own two-plane parallax, and
 * wrapping it would fight the negative top margin that pulls it under the
 * navbar.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ParallaxSection>
        <WhatBringsYou />
      </ParallaxSection>
      <ParallaxSection>
        <HowItWorks />
      </ParallaxSection>
      <ParallaxSection>
        <WhyChoose />
      </ParallaxSection>
      <ParallaxSection>
        <AiReportPreview />
      </ParallaxSection>
      <ParallaxSection>
        <MarketplacePreview />
      </ParallaxSection>
      <ParallaxSection>
        <CategoriesSection />
      </ParallaxSection>
      <ParallaxSection>
        <ConsultantSection />
      </ParallaxSection>
      <ParallaxSection>
        <TestimonialsSection />
      </ParallaxSection>
      <ParallaxSection>
        <CtaSection />
      </ParallaxSection>
    </>
  );
}
