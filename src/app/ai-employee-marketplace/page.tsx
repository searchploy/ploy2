import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/shared/category-icon";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { ListingPreview } from "@/components/seo/listing-preview";
import { RelatedPages } from "@/components/seo/related-pages";
import { CheckList, SeoCta, SeoHero, SeoSection, StepList } from "@/components/seo/seo-page";
import { getLiveCategories } from "@/lib/data/live-marketplace";
import { SEO_PAGES, seoMetadata, siteUrl } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("marketplace");

// Rendered per request — see the note in /ai-employees.

const page = SEO_PAGES.marketplace;

const STEPS = [
  {
    title: "Listings are organised by problem",
    body: "Categories describe the outcome — more leads, better support coverage, less admin work — because that is usually what a business is searching for, rather than a category of software.",
  },
  {
    title: "Each listing states its own scope",
    body: "The tasks it handles, the systems it integrates with, its setup time and its pricing are set by the agency that built it. Two listings in the same category can differ substantially.",
  },
  {
    title: "Listings are reviewed before they appear",
    body: "Every listing goes through moderation before it is published to the marketplace. Review covers the listing itself, not an audit of the product behind it.",
  },
  {
    title: "You deal with the agency directly",
    body: "Ploy refers you to the agency behind a listing. It does not resell, operate or take over support for the AI employee, and the commercial relationship is between you and the provider.",
  },
];

const EVALUATION = [
  "What exactly does it do, and where does it stop? A clear boundary is a better sign than a broad claim.",
  "Which systems does it connect to? An AI employee that cannot reach your CRM or help desk will not do much.",
  "What happens when it is unsure? Look for escalation to a person rather than a guess.",
  "How long does setup take, and who does it — you, or the provider?",
  "What does a person still need to review, and how do they see what it did?",
  "How is it priced — per seat, per conversation, per month — and what happens as volume grows?",
];

export default async function AiEmployeeMarketplacePage() {
  const base = siteUrl();
  const categories = await getLiveCategories();

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

      <SeoHero
        eyebrow="Marketplace"
        heading="AI Employee Marketplace"
        intro="Ploy is an AI employee marketplace that helps businesses discover AI employees for sales, marketing, customer service, recruiting, operations, and other business tasks — in one place, with the details needed to compare them."
        trail={[
          { label: "Home", href: "/" },
          { label: "AI Employees", href: SEO_PAGES.hub.path },
          { label: "AI Employee Marketplace", href: page.path },
        ]}
        cta={{ label: "Browse the marketplace", href: "/marketplace" }}
      />

      <SeoSection id="what-is-it" title="What Is an AI Employee Marketplace?">
        <p>
          An AI employee marketplace is a directory of AI employees from different providers,
          listed in a consistent enough format to be compared. Instead of finding vendors one
          at a time through search results and demo calls, you see what exists for a given
          function side by side.
        </p>
        <p>
          The useful part is not the size of the catalogue — it is that the same questions are
          answered on every listing. What it does, what it connects to, what it costs, how long
          it takes to set up. Those are the details that decide whether something fits, and
          they are the ones hardest to extract from a vendor site.
        </p>
      </SeoSection>

      <SeoSection id="why-use-one" title="Why Businesses Use One">
        <p>
          Most businesses looking at AI for the first time do not have a shortlist — they have a
          problem and no clear sense of what is available. A marketplace is a way to find the
          shape of the market before committing time to any one vendor.
        </p>
        <CheckList
          items={[
            "See several options for the same function without booking a call for each one.",
            "Rule things out early on integrations, pricing or setup time rather than after a demo.",
            "Find providers that would not have surfaced in a search, including smaller agencies.",
            "Understand what a function typically costs before starting a budget conversation.",
          ]}
        />
      </SeoSection>

      <SeoSection id="how-it-works" title="How the Ploy Marketplace Works">
        <StepList steps={STEPS} />
      </SeoSection>

      {categories.length > 0 && (
        <SeoSection id="categories" title="Categories on Ploy">
          <p>
            Listings are grouped by the problem they address. These are the categories currently
            on the marketplace:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <Card key={category.id} className="hover-glow-border p-5">
                <Link
                  href={`/marketplace?category=${category.slug}`}
                  className="flex items-center gap-3 font-semibold text-foreground transition-colors hover:text-ploy-gold"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <CategoryIcon name={category.icon} className="h-4 w-4 text-ploy-gold" />
                  </span>
                  {category.name}
                </Link>
              </Card>
            ))}
          </div>
        </SeoSection>
      )}

      <SeoSection id="evaluating" title="How to Evaluate an AI Employee">
        <p>
          Listings describe what a provider offers, not an independent assessment of it. Before
          committing, these are the questions worth putting to any provider:
        </p>
        <CheckList items={EVALUATION} />
        <p className="mt-2">
          Figures shown on a listing — pricing, setup time, any results quoted — are supplied by
          the provider and are not verified by Ploy.
        </p>
      </SeoSection>

      <ListingPreview
        categorySlugs={["increase-revenue", "improve-customer-support", "automate-admin-work"]}
        title="A Sample of What Is Listed"
        emptyBody="No listings are published yet. Browse the marketplace to see the current catalogue."
        browseHref="/marketplace"
        browseLabel="Browse all listings"
        limit={3}
      />

      <RelatedPages
        title="Browse by Role"
        keys={["sales", "marketing", "customerService", "recruiting"]}
        blurbs={{
          sales: "Lead generation, outreach, qualification and appointment setting.",
          marketing: "Content, social media, SEO research and campaign support.",
          customerService: "FAQ handling, ticket triage, routing and follow-up.",
          recruiting: "Sourcing, screening support, scheduling and candidate communication.",
        }}
      />

      <SeoCta
        title="Find AI Employees on Ploy"
        body="Browse the full marketplace and filter by the problem you want to solve, or start with an overview of what AI employees are and where they fit."
        primary={{ label: "Browse the marketplace", href: "/marketplace" }}
        secondary={{ label: "What is an AI employee?", href: SEO_PAGES.hub.path }}
      />
    </div>
  );
}
