import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = seoMetadata("hub");

// Rendered per request: the shared Supabase server client reads cookies, which
// opts the route out of static generation. Listings therefore reflect
// moderation changes immediately, the same way /marketplace does.

const page = SEO_PAGES.hub;

const TASKS = [
  {
    title: "Repetitive, high-volume work",
    body: "Answering the same twenty support questions, chasing unanswered emails, moving data between a form and a CRM. Work that follows a predictable pattern is where AI employees are most useful.",
  },
  {
    title: "Work that happens outside business hours",
    body: "Replying to an enquiry at 2am or over a weekend. A first response at the moment someone asks is often worth more than a better response two days later.",
  },
  {
    title: "Research and drafting",
    body: "Summarising a prospect before a call, drafting an outreach email, preparing a first version of a job description. A person still reviews and sends the result.",
  },
  {
    title: "Triage and routing",
    body: "Reading an incoming message, working out what it is about, and either handling it or passing it to the right person with the context attached.",
  },
];

const AUDIENCES = [
  "Small businesses without a dedicated person for a function — one AI employee covering first-line support is often the first hire.",
  "Teams with a bottleneck in one role, where the volume of routine work is holding back the work that needs judgement.",
  "Businesses that already have the software but not the hours to use it properly — a CRM nobody updates, a mailbox nobody clears.",
  "Companies testing whether a function can be automated before committing to a permanent hire.",
];

const STEPS = [
  {
    title: "Start with the problem, not the tool",
    body: "Ploy organises AI employees by the outcome you are after — more leads, better support coverage, less admin — rather than by the underlying technology.",
  },
  {
    title: "Compare what is actually on offer",
    body: "Each listing states the tasks it handles, the integrations it supports, its setup time and its pricing, so you can rule things out before speaking to anyone.",
  },
  {
    title: "Go direct to the provider",
    body: "Ploy is a marketplace, not the vendor. When a listing fits, you go to the agency that built it and deal with them directly — Ploy does not process the sale or run the AI employee for you.",
  },
  {
    title: "Or get a recommendation first",
    body: "If you are not sure where to start, the free AI Workforce Report asks about your business and points to the areas where automation is most likely to pay off.",
  },
];

export default function AiEmployeesPage() {
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
        eyebrow="AI Employees"
        heading="AI Employees for Your Business"
        intro="Ploy is an AI employee marketplace. It helps businesses discover AI employees for sales, marketing, customer service, recruiting, operations, and other business tasks — and compare them before committing to one."
        trail={[
          { label: "Home", href: "/" },
          { label: "AI Employees", href: page.path },
        ]}
        cta={{ label: "Browse the marketplace", href: "/marketplace" }}
      />

      <SeoSection id="what-is-an-ai-employee" title="What Is an AI Employee?">
        <p>
          An AI employee is software that handles a defined job function rather than a single
          task. Where a tool waits for you to open it, an AI employee is set up once with
          access to the systems it needs — a mailbox, a CRM, a calendar, a help desk — and then
          works through that function on an ongoing basis.
        </p>
        <p>
          The distinction matters when you are comparing options. A writing assistant helps a
          person write faster. An AI marketing employee is given a brief, a brand voice and
          somewhere to publish, and produces drafts without being prompted each time. The
          second needs more setup and more trust, and is worth more when it fits.
        </p>
        <p>
          &ldquo;AI employee&rdquo; is a description of scope, not a legal or employment term.
          The AI employees listed on Ploy are products built and operated by the agencies
          behind them.
        </p>
      </SeoSection>

      <SeoSection id="how-they-work" title="How AI Employees Work">
        <p>
          Most follow the same shape. A language model handles the reading and writing.
          Integrations give it somewhere to read from and write to. A set of instructions
          defines what it should do, what it should not do, and when it should stop and ask a
          person. The provider maintains all three.
        </p>
        <p>
          That last part is the one worth asking about. A well-built AI employee has clear
          limits — it escalates when it is unsure, and a person can see what it did and step
          in. Capability varies widely between providers, which is why the specifics on a
          listing matter more than the category it sits in.
        </p>
      </SeoSection>

      <SeoSection id="what-can-they-do" title="What Can AI Employees Do?">
        <p>
          Capability depends entirely on the individual AI employee and the systems it connects
          to. Broadly, the work that suits them looks like this:
        </p>
        <TaskGrid items={TASKS} />
        <p className="mt-2">
          Work that needs accountability, negotiation, or a judgement call about a person is
          not on that list. AI employees are generally used to absorb the volume around those
          decisions, not to make them.
        </p>
      </SeoSection>

      <SeoSection id="roles" title="AI Employee Roles">
        <p>
          The clearest way to think about AI employees is by function. Each of these covers
          what the role involves, the tasks it typically takes on, and what to check before
          choosing one:
        </p>
        <CheckList
          items={[
            "Sales — lead generation, qualification, outreach, follow-ups and appointment setting.",
            "Marketing — content drafting, social media, SEO and market research, campaign support.",
            "Customer service — FAQ handling, ticket triage, escalation and follow-up.",
            "Recruiting — sourcing, screening support, interview scheduling and candidate communication.",
            "Operations and admin — data entry, scheduling, reporting and the work between systems.",
          ]}
        />
      </SeoSection>

      <RelatedPages
        title="Explore AI Employees by Role"
        keys={["sales", "marketing", "customerService", "recruiting", "smallBusiness", "marketplace"]}
        blurbs={{
          sales: "What AI sales employees handle across lead generation, outreach and follow-up — and what to ask before choosing one.",
          marketing: "How AI marketing employees support content, social media, SEO research and campaign work.",
          customerService: "Where AI customer service employees fit into a support workflow, including escalation and routing.",
          recruiting: "What AI recruiting employees do across sourcing, screening and scheduling — and where human oversight belongs.",
          smallBusiness: "The functions small businesses most often automate first, and how to work out which one to start with.",
          marketplace: "How the Ploy marketplace works and how to compare listings against each other.",
        }}
      />

      <SeoSection id="who-uses-them" title="Who Uses AI Employees?">
        <CheckList items={AUDIENCES} />
        <p className="mt-2">
          The common thread is a function with more routine volume than the team has hours for.
          If the work is genuinely varied, or the volume is low, the setup effort usually is not
          worth it yet.
        </p>
      </SeoSection>

      <SeoSection id="how-ploy-works" title="How Ploy Works">
        <StepList steps={STEPS} />
      </SeoSection>

      <ListingPreview
        categorySlugs={["generate-more-leads", "improve-customer-support", "create-marketing-content"]}
        title="AI Employees on Ploy"
        emptyBody="No listings are published in these categories yet. Browse the full marketplace to see what is currently available."
        browseHref="/marketplace"
        browseLabel="See all AI employees"
        limit={3}
      />

      <SeoCta
        title="Find an AI Employee for Your Business"
        body="Browse the marketplace by the problem you are trying to solve, or generate a free AI Workforce Report to see which functions in your business are the best candidates for automation."
        primary={{ label: "Browse the marketplace", href: "/marketplace" }}
        secondary={{ label: "Generate a free AI report", href: "/report" }}
      />

      <p className="pb-10 text-sm text-muted-foreground">
        Listing a solution instead?{" "}
        <Link href="/for-agencies" className="text-ploy-gold hover:underline">
          See how agencies list on Ploy
        </Link>
        .
      </p>
    </div>
  );
}
