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

export const metadata: Metadata = seoMetadata("customerService");

// Rendered per request — see the note in /ai-employees.

const page = SEO_PAGES.customerService;

const TASKS = [
  {
    title: "FAQ handling",
    body: "The questions that make up the bulk of most inboxes — hours, delivery times, order status, what is and is not included. High volume, low variation.",
  },
  {
    title: "Answering from your knowledge base",
    body: "Responding from your documented policies and help articles rather than from general knowledge, so answers match what you actually offer.",
  },
  {
    title: "Ticket triage",
    body: "Reading an incoming message, working out what it is about and how urgent it is, and tagging it so the queue is ordered before anyone opens it.",
  },
  {
    title: "Routing and escalation",
    body: "Sending a conversation to the right team, with the history attached, when it goes beyond what the AI employee should handle.",
  },
  {
    title: "Follow-ups",
    body: "Checking back on a resolved ticket, chasing information a customer still owes, and closing threads that have gone quiet.",
  },
  {
    title: "Knowledge base assistance",
    body: "Flagging questions that come up often with no article behind them, and drafting new entries for a person to review.",
  },
  {
    title: "Out-of-hours coverage",
    body: "Acknowledging a message and handling what it can overnight or at a weekend, so a customer is not waiting until Monday for a first reply.",
  },
];

const ESCALATION = [
  {
    title: "Handle the routine directly",
    body: "Questions covered by documented policy are answered straight away. This is where the volume is, and where a fast answer is genuinely better for the customer.",
  },
  {
    title: "Escalate on uncertainty, not just on keywords",
    body: "A well-built AI employee hands over when it does not have a confident answer, rather than producing a plausible one. Ask any provider how this is decided.",
  },
  {
    title: "Escalate anything with consequences",
    body: "Refunds, cancellations, complaints, anything about money or a legal obligation. These should route to a person by default, regardless of how confident the system is.",
  },
  {
    title: "Pass on the full context",
    body: "When a person picks up, they should see the conversation so far. Making the customer repeat themselves undoes most of the benefit.",
  },
];

const QUESTIONS = [
  "Where do its answers come from — your help centre and policies, or general training data?",
  "What does it do when it does not know? Escalation is the answer you want; a confident guess is the failure mode to avoid.",
  "Which channels does it cover — email, live chat, your help desk, social messages?",
  "Does it integrate with your existing help desk, or does it replace it?",
  "Can you see full transcripts of what it handled, and correct it afterwards?",
  "Is it clear to customers that they are talking to an automated system, and can they ask for a person?",
  "How is pricing structured — per conversation, per resolution, or a flat fee?",
];

export default function AiCustomerServiceEmployeesPage() {
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
        eyebrow="Customer Service"
        heading="AI Customer Service Employees"
        intro="AI customer service employees answer the questions that come in repeatedly, triage and route the rest, and keep response times short outside the hours you can staff — escalating to a person when a conversation needs one."
        trail={[
          { label: "Home", href: "/" },
          { label: "AI Employees", href: SEO_PAGES.hub.path },
          { label: "AI Customer Service Employees", href: page.path },
        ]}
        cta={{ label: "Explore AI customer service employees", href: "/marketplace?category=improve-customer-support" }}
      />

      <SeoSection id="what-is-it" title="What Is an AI Customer Service Employee?">
        <p>
          An AI customer service employee sits in your support workflow and handles incoming
          conversations. It is connected to the channels customers use and to the material that
          defines correct answers — your help centre, policies and past tickets — and works
          through the queue continuously.
        </p>
        <p>
          The realistic goal is not to remove people from support. It is to take the repetitive
          share of the queue so the team spends its time on the conversations that need
          attention, and so nobody waits overnight for an acknowledgement.
        </p>
      </SeoSection>

      <SeoSection id="tasks" title="Common Customer Support Tasks">
        <p>What any individual AI employee covers varies by provider and by integration:</p>
        <TaskGrid items={TASKS} />
      </SeoSection>

      <SeoSection id="escalation" title="How Escalation Should Work">
        <p>
          Escalation is the part that determines whether this works in practice. A support
          system that answers confidently when it should have asked for help creates more work
          than it saves:
        </p>
        <StepList steps={ESCALATION} />
      </SeoSection>

      <SeoSection id="capabilities" title="Matching Capability to Your Setup">
        <p>
          Capabilities differ substantially between providers, and the category alone tells you
          very little. One AI employee may answer well from a knowledge base but not connect to
          your help desk. Another may triage and route reliably but not draft answers. A third
          may handle email but not live chat.
        </p>
        <p>
          Choose against the specific capabilities and integrations listed, and confirm them
          with the provider before committing. Nothing here is a claim about what any particular
          listing on Ploy can do — that is set by the agency behind it.
        </p>
      </SeoSection>

      <SeoSection id="questions" title="Questions to Ask Before Choosing One">
        <CheckList items={QUESTIONS} />
      </SeoSection>

      <ListingPreview
        categorySlugs={["improve-customer-support"]}
        title="AI Customer Service Employees on Ploy"
        emptyBody="No customer service listings are published yet. Browse the marketplace to see the current catalogue."
        browseHref="/marketplace?category=improve-customer-support"
        browseLabel="Browse customer service listings"
        limit={3}
      />

      <RelatedPages
        title="Related"
        keys={["hub", "marketplace", "smallBusiness", "sales"]}
        blurbs={{
          hub: "What AI employees are, how they work, and the other roles they cover.",
          marketplace: "How the marketplace works and how to compare listings against each other.",
          smallBusiness: "Why first-line support is often the first function a small business automates.",
          sales: "The pre-sale side of the same conversation — enquiries, qualification and follow-up.",
        }}
      />

      <SeoCta
        title="Explore AI Customer Service Employees"
        body="Browse the customer service listings on the Ploy marketplace, or generate a free AI Workforce Report to see where support automation fits alongside the rest of your business."
        primary={{ label: "Explore AI customer service employees", href: "/marketplace?category=improve-customer-support" }}
        secondary={{ label: "Generate a free AI report", href: "/report" }}
      />
    </div>
  );
}
