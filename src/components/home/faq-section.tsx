import { SectionHeading } from "@/components/shared/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { homeFaqs } from "@/lib/data/faqs";

export function FaqSection() {
  return (
    <section className="py-24">
      <div className="container flex flex-col gap-12">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl">
          {homeFaqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
