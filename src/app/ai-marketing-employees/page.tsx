import type { Metadata } from "next";
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
import { SEO_PAGES, seoMetadata, siteUrl } from "@/lib/seo/pages";

export const metadata: Metadata = seoMetadata("marketing");

// Rendered per request — see the note in /ai-employees.

const page = SEO_PAGES.marketing;

const TASKS = [
  {
    title: "Content creation",
    body: "Drafting blog posts, landing page copy and product descriptions from a brief. Output is a first draft — the editing pass is where it becomes something you would publish.",
  },
  {
    title: "Social media",
    body: "Turning one piece of content into posts for each channel, keeping a schedule filled, and drafting replies to comments for approval.",
  },
  {
    title: "SEO research",
    body: "Finding the terms people use, grouping them by intent, checking what already ranks and identifying where you have nothing to offer a searcher.",
  },
  {
    title: "Market and competitor research",
    body: "Monitoring what competitors publish and change, and summarising it. Genuinely useful and almost never done consistently by hand.",
  },
  {
    title: "Email marketing",
    body: "Drafting campaigns and sequences, segmenting a list against defined rules, and preparing variants to test.",
  },
  {
    title: "Campaign support",
    body: "The work around a launch — assembling assets, adapting one message across channels, keeping the checklist moving.",
  },
  {
    title: "Analytics and reporting",
    body: "Pulling numbers from your analytics and ad platforms into a recurring summary, with the changes worth noticing called out.",
  },
];

const WORKFLOWS = [
  {
    title: "One idea, many channels",
    body: "A single piece of research becomes an article, several social posts and a newsletter section. The repurposing is mechanical, which is exactly what makes it a good fit.",
  },
  {
    title: "Keeping a publishing schedule alive",
    body: "Drafts are prepared ahead of each slot so there is always something in the queue. A person reviews and approves before anything goes out.",
  },
  {
    title: "A standing research brief",
    body: "Competitor pages, pricing and announcements are checked on a schedule and summarised, so you hear about a change in the week it happens rather than months later.",
  },
];

const QUESTIONS = [
  "How does it learn your brand voice — a style guide, examples of past work, or a generic setting?",
  "Does anything publish automatically, or does everything go through approval first? Know this before launch.",
  "Which platforms does it connect to — your CMS, scheduler, email tool, analytics?",
  "Where does its research come from, and can it show sources so claims can be checked?",
  "Who owns the output, and does the provider use your content to train anything?",
  "How does it handle factual claims about your product, pricing or results?",
];

export default function AiMarketingEmployeesPage() {
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

      <SeoHero
        eyebrow="Marketing"
        heading="AI Marketing Employees"
        intro="AI marketing employees help with the recurring production work behind marketing — drafting content, keeping a social schedule filled, running keyword and competitor research, and preparing campaign reporting."
        trail={[
          { label: "Home", href: "/" },
          { label: "AI Employees", href: SEO_PAGES.hub.path },
          { label: "AI Marketing Employees", href: page.path },
        ]}
        cta={{ label: "Explore AI marketing employees", href: "/marketplace?category=create-marketing-content" }}
      />

      <SeoSection id="what-is-it" title="What Is an AI Marketing Employee?">
        <p>
          An AI marketing employee handles a defined slice of marketing production on an
          ongoing basis rather than waiting to be prompted. Given a brief, a brand voice and
          access to the tools you publish through, it produces the drafts and research that
          otherwise sit in a backlog.
        </p>
        <p>
          Capabilities depend heavily on the specific AI employee and the integrations it
          supports. One that writes well may have no way to publish; one that schedules
          reliably may produce weaker copy. The category tells you very little — the listing
          detail is where the difference is.
        </p>
      </SeoSection>

      <SeoSection id="tasks" title="What AI Marketing Employees Can Do">
        <p>Most providers cover a subset of this rather than all of it:</p>
        <TaskGrid items={TASKS} />
        <p className="mt-2">
          Strategy is the part that does not transfer well. Deciding which audience matters,
          what the positioning should be and which bet to take next is judgement work. AI
          marketing employees are generally used to produce against that direction once it is
          set.
        </p>
      </SeoSection>

      <SeoSection id="workflows" title="Example Workflows">
        <StepList steps={WORKFLOWS} />
      </SeoSection>

      <SeoSection id="review" title="Why Review Still Matters">
        <p>
          Marketing output is public and attributed to you. A confident but wrong claim about
          your own pricing, a statistic with no source, or copy that reads nothing like your
          brand are all normal failure modes, and all of them are cheap to catch before
          publishing and expensive afterwards.
        </p>
        <p>
          The setups that work well treat the AI employee as producing drafts by default, with
          automatic publishing reserved for the lowest-risk formats once you have seen enough
          output to trust it.
        </p>
      </SeoSection>

      <SeoSection id="questions" title="Questions to Ask Before Choosing One">
        <CheckList items={QUESTIONS} />
      </SeoSection>

      <ListingPreview
        categorySlugs={["create-marketing-content"]}
        title="AI Marketing Employees on Ploy"
        emptyBody="No marketing listings are published yet. Browse the marketplace to see the current catalogue."
        browseHref="/marketplace?category=create-marketing-content"
        browseLabel="Browse marketing listings"
        limit={3}
      />

      <RelatedPages
        title="Related"
        keys={["hub", "marketplace", "sales", "smallBusiness"]}
        blurbs={{
          hub: "What AI employees are, how they work, and the other roles they cover.",
          marketplace: "How the marketplace works and how to compare listings against each other.",
          sales: "The other half of demand generation — outreach, qualification and follow-up.",
          smallBusiness: "Where marketing automation fits for a small team without a marketing hire.",
        }}
      />

      <SeoCta
        title="Explore AI Marketing Employees"
        body="Browse the marketing listings on the Ploy marketplace, or generate a free AI Workforce Report to see where automation would make the most difference in your business."
        primary={{ label: "Explore AI marketing employees", href: "/marketplace?category=create-marketing-content" }}
        secondary={{ label: "Generate a free AI report", href: "/report" }}
      />
    </div>
  );
}
