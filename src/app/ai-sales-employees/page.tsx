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

export const metadata: Metadata = seoMetadata("sales");

// Rendered per request — see the note in /ai-employees.

const page = SEO_PAGES.sales;

const TASKS = [
  {
    title: "Lead generation",
    body: "Building target lists from a defined profile and enriching them with the details needed to make contact. The definition of a good fit comes from you.",
  },
  {
    title: "Lead qualification",
    body: "Asking the opening questions on an inbound enquiry — budget, timeline, whether you serve their area — so a person picks up the conversation already knowing whether it is worth their time.",
  },
  {
    title: "Outreach",
    body: "Drafting and sending first-touch email or LinkedIn messages against a sequence, personalised from whatever information is available on the prospect.",
  },
  {
    title: "Follow-ups",
    body: "The sequence after the first message. This is the task most often dropped by a busy team and the one where automation reliably recovers revenue.",
  },
  {
    title: "Appointment setting",
    body: "Handling the back-and-forth of finding a time, sending the invite, and chasing no-shows to rebook.",
  },
  {
    title: "CRM hygiene",
    body: "Logging activity, updating stages and filling in fields after a call, so the pipeline reflects reality without a rep spending their evening on data entry.",
  },
  {
    title: "Reporting",
    body: "Pulling together pipeline and activity summaries on a schedule instead of someone rebuilding the same spreadsheet each week.",
  },
];

const WORKFLOWS = [
  {
    title: "Inbound enquiry to booked call",
    body: "A form is submitted. The AI employee replies within minutes, asks two or three qualifying questions, and books a time on the right person's calendar. Anything that does not fit the criteria is routed to a human to look at rather than rejected.",
  },
  {
    title: "Outbound sequence with a human handoff",
    body: "A list is built to an agreed profile. First touch and follow-ups go out automatically. The moment a prospect replies with genuine interest, the thread is handed to a salesperson with the history attached.",
  },
  {
    title: "Reviving a stale pipeline",
    body: "Opportunities that have gone quiet past a certain age get a re-engagement message. Most produce nothing; the few that reply are worth more than the effort, which is why the task suits automation.",
  },
];

const SUITS = [
  "More inbound enquiries arrive than the team can respond to quickly.",
  "Follow-up is inconsistent — deals go quiet because nobody circled back, not because the prospect said no.",
  "Your sales process is defined enough to write down. Automation amplifies a clear process and amplifies the problems in an unclear one.",
  "Reps spend a significant share of their week on admin rather than conversations.",
];

const QUESTIONS = [
  "Which CRM does it write to, and does it work with your pipeline stages as they are set up now?",
  "Who writes the messaging, and can you review and edit sequences before anything sends?",
  "What triggers a handoff to a person, and does the salesperson get the full conversation history?",
  "How does it handle an unsubscribe or a request to stop contacting someone?",
  "Are messages sent from your domain, and what does that mean for your sending reputation?",
  "How is it priced as volume grows — per contact, per message, or a flat monthly fee?",
];

export default function AiSalesEmployeesPage() {
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
        eyebrow="Sales"
        heading="AI Sales Employees"
        intro="AI sales employees take on the repetitive parts of a sales process — list building, first-touch outreach, follow-up, appointment setting and CRM updates — so the people on your team spend more of their time in conversations."
        trail={[
          { label: "Home", href: "/" },
          { label: "AI Employees", href: SEO_PAGES.hub.path },
          { label: "AI Sales Employees", href: page.path },
        ]}
        cta={{ label: "Explore AI sales employees", href: "/marketplace?category=generate-more-leads" }}
      />

      <SeoSection id="what-is-it" title="What Is an AI Sales Employee?">
        <p>
          An AI sales employee is software that runs defined parts of a sales process on an
          ongoing basis. It is connected to your CRM and your mailbox, given a target profile
          and a sequence, and left to work through the volume — building lists, sending first
          messages, following up and recording what happened.
        </p>
        <p>
          It is not a replacement for a salesperson. The parts of selling that decide deals —
          understanding an unusual requirement, handling a real objection, negotiating, building
          a relationship over months — are human work, and the sensible setups are built around
          that. What an AI sales employee changes is how much of the week your team spends on
          the surrounding admin.
        </p>
      </SeoSection>

      <SeoSection id="tasks" title="Sales Tasks AI Can Assist With">
        <p>
          Which of these any individual AI sales employee covers varies by provider — most
          specialise rather than doing all of it:
        </p>
        <TaskGrid items={TASKS} />
      </SeoSection>

      <SeoSection id="workflows" title="Example Workflows">
        <p>Three common shapes, each with a defined point where a person takes over:</p>
        <StepList steps={WORKFLOWS} />
      </SeoSection>

      <SeoSection id="who" title="Who Should Consider One">
        <CheckList items={SUITS} />
        <p className="mt-2">
          If your deals are few, large and highly bespoke, the return is usually smaller — there
          is not enough repetition to automate, and the first touch matters too much to delegate.
        </p>
      </SeoSection>

      <SeoSection id="questions" title="Questions to Ask Before Choosing One">
        <CheckList items={QUESTIONS} />
      </SeoSection>

      <ListingPreview
        categorySlugs={["generate-more-leads", "increase-revenue"]}
        title="AI Sales Employees on Ploy"
        emptyBody="No sales listings are published yet. Browse the marketplace to see the current catalogue."
        browseHref="/marketplace?category=generate-more-leads"
        browseLabel="Browse sales listings"
        limit={3}
      />

      <RelatedPages
        title="Related"
        keys={["hub", "marketplace", "smallBusiness", "customerService"]}
        blurbs={{
          hub: "What AI employees are, how they work, and the other roles they cover.",
          marketplace: "How the marketplace works and how to compare listings against each other.",
          smallBusiness: "Where sales automation fits when there is no dedicated sales team.",
          customerService: "The support side of the same customer conversation.",
        }}
      />

      <SeoCta
        title="Explore AI Sales Employees"
        body="Browse the sales listings on the Ploy marketplace, or generate a free AI Workforce Report to see whether sales is the function worth automating first in your business."
        primary={{ label: "Explore AI sales employees", href: "/marketplace?category=generate-more-leads" }}
        secondary={{ label: "Generate a free AI report", href: "/report" }}
      />
    </div>
  );
}
