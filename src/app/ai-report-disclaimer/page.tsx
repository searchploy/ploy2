import type { Metadata } from "next";
import Link from "next/link";
import { Callout, DraftNotice, LegalPage, List, Section } from "@/components/legal/legal-page";
import { LEGAL_VERSIONS } from "@/lib/legal/constants";

export const metadata: Metadata = {
  title: "AI Report Disclaimer",
  description:
    "How Ploy's AI Reports and implementation roadmaps are generated, what the estimates mean, and what Ploy does and does not guarantee.",
};

const SECTIONS = [
  { id: "what-it-is", heading: "What an AI Report is" },
  { id: "how-generated", heading: "How your report is generated" },
  { id: "recommendations", heading: "About the recommendations" },
  { id: "estimates", heading: "About the estimates" },
  { id: "roadmap", heading: "About the roadmap" },
  { id: "no-guarantees", heading: "What Ploy does not guarantee" },
  { id: "your-responsibility", heading: "Evaluating a provider yourself" },
  { id: "not-advice", heading: "Not professional advice" },
];

export default function AiReportDisclaimerPage() {
  return (
    <LegalPage
      title="AI Report Disclaimer"
      updated="September 16, 2026"
      version={LEGAL_VERSIONS.ai_report_disclaimer}
      sections={SECTIONS}
      intro={
        <p>
          Ploy&apos;s AI Reports and implementation roadmaps are planning tools. This page explains
          in plain terms how they are produced, what the numbers in them mean, and where you should
          apply your own judgment before spending money.
        </p>
      }
    >
      <DraftNotice />

      <Section id="what-it-is" number={1} heading="What an AI Report is">
        <p>
          An AI Report is an automated analysis of the information you enter about your business. It
          produces a readiness score, a list of the bottlenecks your answers point to, suggested AI
          employees from the Ploy marketplace, and — for Ploy Pro subscribers — a sequenced 30-day,
          90-day and one-year implementation roadmap.
        </p>
        <p>
          It is provided for informational and planning purposes. It is a starting point for a
          decision, not the decision itself.
        </p>
      </Section>

      <Section id="how-generated" number={2} heading="How your report is generated">
        <p>
          Your report is produced by Ploy&apos;s own scoring engine. The engine applies a fixed set
          of rules and weightings to two inputs:
        </p>
        <List
          items={[
            "The information you provide in the report questionnaire — your industry, team size, revenue range, departments, current software, stated problems and goals.",
            "The published listings in the Ploy marketplace at the time your report is generated, including each listing's stated role, tasks, integrations, setup time and price.",
          ]}
        />
        <p>
          The same answers produce the same report. Nothing in your report is written by a person
          reviewing your business, and Ploy does not send your report inputs to a third-party
          language model to generate the results.
        </p>
      </Section>

      <Section id="recommendations" number={3} heading="About the recommendations">
        <p>
          Recommended AI employees are marketplace listings whose stated capabilities matched your
          answers most closely under the engine&apos;s scoring rules. A recommendation means a
          listing scored well against what you told us. It is not an endorsement, a certification,
          or a finding that the product will work for you.
        </p>
        <p>
          Marketplace listings are created by independent third-party providers, who are responsible
          for the accuracy of what their listing says. Ploy reviews listings before they appear on
          the marketplace, but that review does not verify that a provider&apos;s product performs
          as described.
        </p>
        <p>
          Listings belonging to Ploy Pro subscribers may receive additional weighting in the
          marketplace ordering and additional exposure in eligible reports. This is disclosed
          wherever Ploy Pro visibility is described, and it does not override how well a listing
          matches your answers.
        </p>
      </Section>

      <Section id="estimates" number={4} heading="About the estimates">
        <p>
          Figures such as estimated annual savings, estimated hours saved, estimated ROI, estimated
          monthly investment and any potential revenue impact are <strong>modelled estimates</strong>,
          calculated from the information you provided and from assumptions built into Ploy&apos;s
          analysis. They are not measurements of your business and not projections Ploy stands
          behind.
        </p>
        <p>
          Where your report or roadmap shows its workings, the assumptions used are listed alongside
          the numbers. Where there is not enough information to estimate something responsibly, the
          report says so rather than producing a figure.
        </p>
        <Callout title="Read every number as an estimate">
          <p>
            Actual results depend on your data, your team, how completely you implement a change,
            the provider you choose, and conditions outside anyone&apos;s control. Your results will
            differ from the estimates, and may be materially lower.
          </p>
        </Callout>
      </Section>

      <Section id="roadmap" number={5} heading="About the roadmap">
        <p>
          The 30-day, 90-day and one-year roadmap sequences the recommended workflows into a
          suggested order of work, with owners, dependencies, KPIs and estimated impact per phase.
        </p>
        <List
          items={[
            "Timelines are planning estimates, not commitments or quotes.",
            "Cost figures use each listing's published monthly price. Listings without published pricing are excluded from totals and marked as such.",
            "Potential savings and value figures are estimates carried over from the report's assumptions.",
            "The suggested priority order may not suit your circumstances — resequencing it is expected, not a sign something is wrong.",
            "Difficulty levels and setup times are approximate bands supplied or inferred from listings, not provider quotes.",
          ]}
        />
        <p>
          Whether the plan produces anything depends on implementation, which is in your hands and
          your chosen providers&apos;, not Ploy&apos;s.
        </p>
      </Section>

      <Section id="no-guarantees" number={6} heading="What Ploy does not guarantee">
        <p>
          Ploy does not guarantee, warrant or promise any of the following as a result of an AI
          Report, a roadmap, or acting on either:
        </p>
        <List
          items={[
            "Revenue increases, sales, leads, conversions or business growth",
            "Cost savings, hours saved, productivity improvements or return on investment",
            "That a recommended AI employee, workflow, provider or strategy is suitable for your business",
            "That a third-party product will perform as its listing describes",
            "That an implementation will succeed, or succeed within an estimated timeframe",
            "That the information you supplied, or a provider supplied, is accurate or complete",
          ]}
        />
      </Section>

      <Section id="your-responsibility" number={7} heading="Evaluating a provider yourself">
        <p>
          Before purchasing or implementing an AI employee, you should independently evaluate the
          provider and the product. At a minimum, that means looking at:
        </p>
        <List
          items={[
            "The provider's identity, track record and support commitments",
            "What the product actually does, and whether it fits your workflow",
            "Current pricing and contract terms, which are set by the provider and may differ from what a listing shows",
            "Security practices, and how your data would be stored, processed and retained",
            "Privacy obligations that apply to your business and whether the provider can meet them",
            "The provider's own terms of service and privacy policy",
          ]}
        />
        <p>
          Any purchase, agreement or relationship you enter into with a provider is between you and
          that provider. Ploy is not a party to it and does not process those transactions.
        </p>
      </Section>

      <Section id="not-advice" number={8} heading="Not professional advice">
        <p>
          An AI Report is not business, financial, investment, legal, tax, security or technical
          advice, and it is not a substitute for a professional who knows your circumstances. Ploy
          is not acting as your advisor by producing one. For decisions with meaningful financial,
          legal or security consequences, consult an appropriately qualified professional.
        </p>
        <p>
          This disclaimer forms part of the{" "}
          <Link href="/terms" className="text-ploy-gold underline-offset-4 hover:underline">
            Ploy Terms of Service
          </Link>
          . Information you enter into a report is handled as described in the{" "}
          <Link href="/privacy" className="text-ploy-gold underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
