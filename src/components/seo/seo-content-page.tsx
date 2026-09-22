import { JsonLd } from "@/components/seo/json-ld";
import { ListingPreview } from "@/components/seo/listing-preview";
import { RelatedPages } from "@/components/seo/related-pages";
import {
  CheckList,
  SeoCta,
  SeoHero,
  SeoSection,
  StepList,
  TaskGrid,
} from "@/components/seo/seo-page";
import { SEO_PAGES, siteUrl, type SeoPageKey } from "@/lib/seo/pages";
import type { SeoContent } from "@/lib/seo/content-types";

/**
 * Renders a landing page from its content definition. The AI-tool and
 * problem pages all share this shape, so the route files stay thin and the
 * writing lives in one place per group.
 */
export function SeoContentPage({
  pageKey,
  content,
}: {
  pageKey: SeoPageKey;
  content: SeoContent;
}) {
  const page = SEO_PAGES[pageKey];
  const base = siteUrl();

  return (
    <div className="container max-w-4xl pb-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.description,
          url: `${base}${page.path}`,
          isPartOf: { "@type": "WebSite", name: "Ploy", url: base },
        }}
      />

      {content.faqs && content.faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }}
        />
      )}

      <SeoHero
        eyebrow={content.eyebrow}
        heading={content.heading}
        intro={content.intro}
        trail={content.trail}
        cta={content.cta}
      />

      {content.sections.map((section) => (
        <SeoSection key={section.id} id={section.id} title={section.title}>
          {section.lead?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.kind === "tasks" && <TaskGrid items={section.items} />}
          {section.kind === "steps" && <StepList steps={section.items} />}
          {section.kind === "checks" && <CheckList items={section.items} />}
          {section.footnote && <p className="mt-2">{section.footnote}</p>}
        </SeoSection>
      ))}

      {content.faqs && content.faqs.length > 0 && (
        <SeoSection id="faq" title="Common Questions">
          <dl className="flex flex-col gap-6">
            {content.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="mb-1.5 text-base font-bold text-foreground">{faq.question}</dt>
                <dd className="text-[15px] leading-relaxed text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </SeoSection>
      )}

      {content.listing && (
        <ListingPreview
          categorySlugs={page.categorySlugs}
          title={content.listing.title}
          emptyBody={content.listing.emptyBody}
          browseHref={content.listing.browseHref}
          browseLabel={content.listing.browseLabel}
          limit={3}
        />
      )}

      <RelatedPages title="Related" keys={content.related.keys} blurbs={content.related.blurbs} />

      <SeoCta
        title={content.closing.title}
        body={content.closing.body}
        primary={content.closing.primary}
        secondary={content.closing.secondary}
      />
    </div>
  );
}
