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

export const metadata: Metadata = seoMetadata("smallBusiness");

// Rendered per request — see the note in /ai-employees.

const page = SEO_PAGES.smallBusiness;

const FUNCTIONS = [
  {
    title: "Sales",
    body: "Following up on enquiries that went cold, qualifying inbound leads before they reach the owner, and keeping the CRM current. In a small business the follow-up is usually what gets dropped first.",
  },
  {
    title: "Customer service",
    body: "Answering the questions that come in repeatedly — opening hours, order status, what you do and do not cover — and passing anything unusual to a person.",
  },
  {
    title: "Marketing",
    body: "Drafting posts and emails on a schedule, so marketing continues during a busy month instead of stopping. Someone still approves what goes out.",
  },
  {
    title: "Recruiting",
    body: "Handling the volume around a hire: acknowledging applicants, arranging interview times, keeping candidates informed. Useful when hiring is occasional and there is no recruiter.",
  },
  {
    title: "Admin and operations",
    body: "Moving information between systems, preparing recurring reports, chasing missing paperwork. Rarely urgent, which is why it accumulates.",
  },
  {
    title: "Scheduling and coordination",
    body: "Booking appointments, sending reminders, handling reschedules. A common first choice because the task is well defined and the outcome is easy to check.",
  },
];

const WHY = [
  "There is no one to delegate to. In a small team the routine work lands on whoever is already busiest, usually the owner.",
  "Coverage gaps cost real money. An enquiry that waits until Monday is often an enquiry that goes elsewhere.",
  "A part-time need is hard to hire for. Plenty of functions need a few hours a day, which is an awkward role to fill.",
  "The cost is easier to reverse than a hire. If it does not work, you stop paying for it.",
];

const CHOOSING = [
  {
    title: "Pick the task you would hand over first",
    body: "If you could give one recurring task to a new person tomorrow, that is usually the right starting point. It is well understood, so you will recognise quickly whether it is being done properly.",
  },
  {
    title: "Check it can reach your systems",
    body: "The value depends on access. If your bookings live in one tool and your enquiries in another, confirm the AI employee connects to both before anything else.",
  },
  {
    title: "Decide what it must not do alone",
    body: "Issuing refunds, making promises about price, sending anything to your whole list. Agree the boundary at the start rather than after something goes out.",
  },
  {
    title: "Start with one, not five",
    body: "One function running properly is worth more than several half-configured. It also gives you a real basis for judging whether the second is worth it.",
  },
];

export default function AiEmployeesForSmallBusinessPage() {
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
        eyebrow="Small Business"
        heading="AI Employees for Small Businesses"
        intro="AI employees can take on the recurring work a small team does not have hours for — follow-ups, first-line support, scheduling and admin. Ploy helps you find one for the function you want to cover first."
        trail={[
          { label: "Home", href: "/" },
          { label: "AI Employees", href: SEO_PAGES.hub.path },
          { label: "For Small Business", href: page.path },
        ]}
        cta={{ label: "Find an AI employee", href: "/marketplace" }}
      />

      <SeoSection id="why" title="Why Small Businesses Look at AI Employees">
        <CheckList items={WHY} />
        <p className="mt-2">
          None of that makes an AI employee the right answer on its own. It is worth the setup
          when a task is repetitive, happens often, and follows rules you could write down. If
          you cannot describe the task clearly to a new starter, it is not ready to hand over.
        </p>
      </SeoSection>

      <SeoSection id="functions" title="AI Employees Small Businesses Can Use">
        <p>
          These are the functions small businesses most commonly automate first. What any
          individual AI employee covers depends on the provider:
        </p>
        <TaskGrid items={FUNCTIONS} />
      </SeoSection>

      <SeoSection id="choosing" title="How to Work Out Which One You Need">
        <StepList steps={CHOOSING} />
      </SeoSection>

      <ListingPreview
        categorySlugs={["automate-admin-work"]}
        title="AI Employees for Admin and Operations"
        emptyBody="No listings are published in this category yet. Browse the marketplace to see what is currently available."
        browseHref="/marketplace?category=automate-admin-work"
        browseLabel="Browse admin and operations listings"
        limit={3}
      />

      <RelatedPages
        title="Explore by Function"
        keys={["sales", "customerService", "marketing", "recruiting"]}
        blurbs={{
          sales: "For follow-ups, lead qualification and keeping the pipeline moving without a dedicated salesperson.",
          customerService: "For first-line questions and coverage outside the hours you can staff.",
          marketing: "For keeping content and email going during the months when marketing would otherwise stop.",
          recruiting: "For the scheduling and communication around a hire when there is no recruiter in the business.",
        }}
      />

      <SeoCta
        title="Find an AI Employee"
        body="Browse the marketplace by the problem you want to solve, or generate a free AI Workforce Report — it asks about your business and points to the functions most worth automating first."
        primary={{ label: "Find an AI employee", href: "/marketplace" }}
        secondary={{ label: "Generate a free AI report", href: "/report" }}
      />
    </div>
  );
}
