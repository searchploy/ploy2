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

export const metadata: Metadata = seoMetadata("recruiting");

// Rendered per request — see the note in /ai-employees.

const page = SEO_PAGES.recruiting;

const TASKS = [
  {
    title: "Candidate sourcing",
    body: "Searching for candidates matching a defined brief and assembling a longlist with the details needed to make contact.",
  },
  {
    title: "Screening assistance",
    body: "Checking applications against the stated requirements and surfacing what a reviewer needs to see. The assessment supports a human decision rather than replacing it.",
  },
  {
    title: "Interview scheduling",
    body: "Coordinating times across several calendars, sending invitations, and handling reschedules. Pure logistics, and one of the clearest wins in the whole process.",
  },
  {
    title: "Candidate communication",
    body: "Acknowledging applications, answering questions about the role and process, and keeping people informed about where they stand.",
  },
  {
    title: "Workflow support",
    body: "Moving candidates through your pipeline stages, prompting interviewers for overdue feedback, and flagging applications that have stalled.",
  },
  {
    title: "Recruiting administration",
    body: "Keeping the applicant tracking system current, preparing interview packs and assembling hiring reports.",
  },
  {
    title: "Job description drafting",
    body: "Producing a first draft from a role brief, for a hiring manager to review and correct.",
  },
];

const OVERSIGHT = [
  {
    title: "Keep hiring decisions with people",
    body: "Decisions about who advances, who is rejected and who is hired should be made by a person who can explain the reasoning. Use these tools to prepare and organise information, not to decide on it.",
  },
  {
    title: "Treat screening output as a recommendation",
    body: "A ranking or a score is an input to a review, not a verdict. Reviewers should be able to see the underlying application and disagree with the ordering.",
  },
  {
    title: "Know what the tool is assessing",
    body: "If you cannot find out what a screening feature actually measures, that is a reason for caution. You may have to explain a rejection to a candidate, a regulator or a court.",
  },
  {
    title: "Check your legal obligations",
    body: "Several jurisdictions regulate automated tools used in hiring, with requirements that can include bias auditing, candidate notice and record keeping. Rules differ by location and change; take your own legal advice for the places you hire in.",
  },
];

const QUESTIONS = [
  "Which parts of the process does it touch, and does anything reject a candidate without a person reviewing it?",
  "What does any scoring or ranking feature actually measure, and can that be explained to a candidate?",
  "Has the provider carried out bias testing, and will they share the results?",
  "Does it integrate with your applicant tracking system, or does it sit outside your existing records?",
  "Where is candidate data stored, how long is it kept, and how are data protection obligations handled?",
  "Are candidates told when they are interacting with an automated system?",
  "Can you export a full record of what happened to each application?",
];

export default function AiRecruitingEmployeesPage() {
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
        eyebrow="Recruiting"
        heading="AI Recruiting Employees"
        intro="AI recruiting employees take on the coordination and administration around hiring — sourcing, screening support, interview scheduling and candidate communication — while hiring decisions stay with the people accountable for them."
        trail={[
          { label: "Home", href: "/" },
          { label: "AI Employees", href: SEO_PAGES.hub.path },
          { label: "AI Recruiting Employees", href: page.path },
        ]}
        cta={{ label: "Explore AI recruiting employees", href: "/marketplace?category=improve-recruiting" }}
      />

      <SeoSection id="what-is-it" title="What Is an AI Recruiting Employee?">
        <p>
          An AI recruiting employee handles the operational work around hiring on an ongoing
          basis. Connected to your applicant tracking system, calendars and mailbox, it sources
          candidates, keeps applicants informed, arranges interviews and maintains the pipeline
          between rounds.
        </p>
        <p>
          Hiring has an unusually high administrative load relative to the number of decisions
          made. A single role can mean hundreds of applications, dozens of scheduling threads
          and constant status updates — and most of that work is coordination rather than
          judgement. That coordination is what these tools are best suited to.
        </p>
      </SeoSection>

      <SeoSection id="tasks" title="What AI Recruiting Employees Do">
        <p>Coverage varies by provider — most handle a subset of this:</p>
        <TaskGrid items={TASKS} />
      </SeoSection>

      <SeoSection id="oversight" title="Where Human Oversight Belongs">
        <p>
          Hiring decisions affect people&apos;s livelihoods and are legally regulated in ways
          most business automation is not. No AI system is free of bias — a model trained on
          past hiring data can reproduce the patterns in that data, including ones you would not
          choose to continue. Treat any claim of neutral or objective screening with scepticism.
        </p>
        <StepList steps={OVERSIGHT} />
        <p className="mt-2">
          This is general information about using these tools, not legal advice.
        </p>
      </SeoSection>

      <SeoSection id="where-it-helps" title="Where the Time Is Actually Saved">
        <p>
          The clearest returns are in the parts of recruiting with no judgement in them at all.
          Interview scheduling is the obvious one: coordinating several calendars is pure
          logistics, and handing it over costs nothing in fairness or accountability.
        </p>
        <p>
          Candidate communication is a close second. Most applicants never hear anything back,
          not out of indifference but because keeping hundreds of people updated by hand is
          impractical. Automating acknowledgements and status updates improves the candidate
          experience in a way that is hard to argue against.
        </p>
      </SeoSection>

      <SeoSection id="questions" title="Questions to Ask Before Choosing One">
        <CheckList items={QUESTIONS} />
      </SeoSection>

      <ListingPreview
        categorySlugs={["improve-recruiting"]}
        title="AI Recruiting Employees on Ploy"
        emptyBody="No recruiting listings are published yet. Browse the marketplace to see the current catalogue."
        browseHref="/marketplace?category=improve-recruiting"
        browseLabel="Browse recruiting listings"
        limit={3}
      />

      <RelatedPages
        title="Related"
        keys={["hub", "marketplace", "smallBusiness", "customerService"]}
        blurbs={{
          hub: "What AI employees are, how they work, and the other roles they cover.",
          marketplace: "How the marketplace works and how to compare listings against each other.",
          smallBusiness: "Where recruiting support fits for a business hiring occasionally without a recruiter.",
          customerService: "Another role built on high-volume conversation handling.",
        }}
      />

      <SeoCta
        title="Explore AI Recruiting Employees"
        body="Browse the recruiting listings on the Ploy marketplace, or generate a free AI Workforce Report to see which parts of your business are the best candidates for automation."
        primary={{ label: "Explore AI recruiting employees", href: "/marketplace?category=improve-recruiting" }}
        secondary={{ label: "Generate a free AI report", href: "/report" }}
      />
    </div>
  );
}
