import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { homeFaqs } from "@/lib/data/faqs";

export const metadata: Metadata = { title: "Help Center" };

export default function HelpPage() {
  return (
    <div className="container max-w-3xl py-20">
      <SectionHeading eyebrow="Help Center" title="How can we help?" description="Answers to the questions we hear most often." />
      <Accordion type="single" collapsible className="mt-14">
        {homeFaqs.map((faq, i) => (
          <AccordionItem key={i} value={`help-${i}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
