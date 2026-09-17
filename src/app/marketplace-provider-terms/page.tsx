import type { Metadata } from "next";
import Link from "next/link";
import { Callout, DraftNotice, LegalPage, List, Section } from "@/components/legal/legal-page";
import { LEGAL_VERSIONS, SUPPORT_EMAIL } from "@/lib/legal/constants";

export const metadata: Metadata = {
  title: "Marketplace Provider Terms",
  description:
    "The terms that apply when you list an AI employee on the Ploy marketplace: what you're representing, what you remain responsible for, and how Ploy moderates listings.",
};

const SECTIONS = [
  { id: "who", heading: "Who these terms apply to" },
  { id: "relationship", heading: "Your relationship with Ploy" },
  { id: "representations", heading: "What you are representing" },
  { id: "accuracy", heading: "Listing accuracy and claims" },
  { id: "responsibility", heading: "What you remain responsible for" },
  { id: "prohibited", heading: "Prohibited conduct" },
  { id: "review", heading: "Review, rejection and removal" },
  { id: "reports", heading: "Reports about your listing" },
  { id: "visibility", heading: "Marketplace visibility and Ploy Pro" },
  { id: "content-licence", heading: "Your listing content" },
  { id: "termination", heading: "Suspension and termination" },
  { id: "changes", heading: "Changes to these terms" },
];

export default function MarketplaceProviderTermsPage() {
  return (
    <LegalPage
      title="Marketplace Provider Terms"
      updated="September 16, 2026"
      version={LEGAL_VERSIONS.marketplace_provider_terms}
      sections={SECTIONS}
      intro={
        <p>
          These terms apply when you submit an AI employee listing to the Ploy marketplace. You
          accept them when you submit or update a listing. They are in addition to the{" "}
          <Link href="/terms" className="text-ploy-gold underline-offset-4 hover:underline">
            Ploy Terms of Service
          </Link>
          , which also apply to your account.
        </p>
      }
    >
      <DraftNotice />

      <Section id="who" number={1} heading="Who these terms apply to">
        <p>
          These terms apply to you if you create, submit, edit or maintain a marketplace listing on
          Ploy — whether you built the AI employee yourself, work for the company that did, or are
          authorised to represent it. In these terms &quot;you&quot; means both you personally and
          the business you are listing on behalf of.
        </p>
      </Section>

      <Section id="relationship" number={2} heading="Your relationship with Ploy">
        <p>
          You are an independent third party. Listing on Ploy does not make you an employee, agent,
          partner, joint venturer or franchisee of Ploy, and does not make Ploy a seller, reseller,
          distributor or guarantor of your product.
        </p>
        <p>
          Ploy operates a discovery marketplace. Businesses find your listing on Ploy and are sent
          to your own website to learn more or buy. Ploy does not sell your product, take payment
          for it, process your customers&apos; transactions, or hold funds on your behalf.
        </p>
        <Callout title="Ploy does not take a commission">
          <p>
            Ploy does not charge a commission, referral fee or revenue share on sales you make to
            businesses that find you through the marketplace. Listing is free; Ploy Pro is an
            optional subscription paid by you to Ploy, and is unrelated to what your customers pay
            you.
          </p>
        </Callout>
      </Section>

      <Section id="representations" number={3} heading="What you are representing">
        <p>By submitting a listing, you represent and warrant that:</p>
        <List
          items={[
            "You have the right to list the product or service, and to use the name, branding, logo and any other material in your listing.",
            "You are authorised to enter into these terms on behalf of the business named in the listing.",
            "The information in your listing is accurate and not misleading at the time you submit it.",
            "The pricing shown in your listing is accurate, and you will update it when it changes.",
            "Your listing does not impersonate, or imply an association with, a company or person you are not authorised to represent.",
            "The product or service you are listing actually exists and is available to the businesses you are offering it to.",
          ]}
        />
      </Section>

      <Section id="accuracy" number={4} heading="Listing accuracy and claims">
        <p>
          You are responsible for everything your listing says. Claims about what your product does,
          who it is suitable for, what it costs, what it integrates with and how long it takes to
          set up must be ones you can support.
        </p>
        <List
          items={[
            "Do not make performance, savings, revenue or ROI claims you cannot substantiate.",
            "Do not present estimates, projections or best-case figures as guaranteed outcomes.",
            "Do not describe capabilities your product does not currently have, including ones you plan to build.",
            "Do not misrepresent pricing — including by omitting mandatory fees, minimum terms or setup costs that a buyer would need to know about.",
            "Keep your listing current. If your product, pricing or availability changes materially, update the listing.",
          ]}
        />
        <p>
          Any figures Ploy displays from your listing — such as a stated average ROI or expected
          monthly savings — are presented as provider-reported and are attributed to you, not to
          Ploy.
        </p>
      </Section>

      <Section id="responsibility" number={5} heading="What you remain responsible for">
        <p>
          Ploy&apos;s role ends when a business leaves for your website. Everything after that is
          yours, including:
        </p>
        <List
          items={[
            "Your product or service, and whether it performs as described",
            "Transactions, billing, refunds and chargebacks on your own website",
            "Your contracts, terms of service and privacy policy with your customers",
            "Customer support, onboarding, implementation and ongoing service",
            "The security of your systems and of any customer data you collect or process",
            "Your privacy and data-protection obligations, wherever your customers are located",
            "Compliance with all laws and regulations that apply to your business, your product, your marketing and your industry",
          ]}
        />
      </Section>

      <Section id="prohibited" number={6} heading="Prohibited conduct">
        <p>You must not use the Ploy marketplace to:</p>
        <List
          items={[
            "Submit a fraudulent listing, or a listing for a product that does not exist",
            "Impersonate another business or person, or falsely claim an affiliation or endorsement",
            "Make deceptive, unsubstantiated or knowingly false claims",
            "Misrepresent your pricing or your product's capabilities",
            "Upload malware, malicious code, or content that harms users or Ploy's systems",
            "Collect personal information from Ploy users in ways they have not agreed to, or outside what your own privacy policy discloses",
            "Manipulate marketplace ranking, ratings, reviews or search results, including through fake reviews or duplicate listings",
            "Attempt to influence which listings Ploy's AI Report engine recommends, other than by accurately describing your product",
            "Circumvent, or attempt to circumvent, Ploy's listing review process",
            "Harass, spam or abuse Ploy users, Ploy staff or other providers",
            "Carry out or facilitate any illegal activity",
          ]}
        />
        <p>
          Some of these are enforced technically as well as contractually. For example, a listing
          owner cannot publish or approve their own listing, and cannot change its moderation status
          — those actions are restricted to Ploy administrators at the database level.
        </p>
      </Section>

      <Section id="review" number={7} heading="Review, rejection and removal">
        <p>
          Every listing is reviewed before it appears on the marketplace, and every edit to an
          approved listing returns it to review. Your listing is temporarily off the marketplace
          while an edit is being reviewed.
        </p>
        <List
          items={[
            "Ploy may approve, reject or request changes to a listing at its discretion.",
            "Ploy may remove or suspend a listing that breaches these terms, appears inaccurate, or is the subject of a credible complaint.",
            "Ploy may suspend or terminate an account for repeated or serious breaches.",
            "Ploy is not obliged to list, keep listing, or rank any particular listing.",
          ]}
        />
        <Callout title="What approval means">
          <p>
            Marketplace approval means a listing has been reviewed for inclusion on Ploy. It is not
            a certification, an endorsement, or a verification that your product performs as
            described, and it does not mean Ploy guarantees your performance, security, results or
            suitability. You must not describe your listing as Ploy-endorsed, Ploy-certified,
            Ploy-verified or Ploy-guaranteed.
          </p>
        </Callout>
      </Section>

      <Section id="reports" number={8} heading="Reports about your listing">
        <p>
          Users can report a listing they believe is misleading, fraudulent, incorrectly priced or
          otherwise problematic. A report is an allegation, not a finding: Ploy reviews reports
          before taking any action, and a report on its own is not treated as proof of wrongdoing.
        </p>
        <p>
          Ploy may contact you about a report, ask for information, and take action ranging from no
          action through to removing the listing or suspending the account. Reports are visible only
          to the person who filed them and to Ploy administrators.
        </p>
      </Section>

      <Section id="visibility" number={9} heading="Marketplace visibility and Ploy Pro">
        <p>
          Approved listings appear on the marketplace. Ordering depends on the sort a visitor
          chooses and, in the default ordering, on relevance signals including how well a listing
          matches what the visitor is looking for.
        </p>
        <p>
          Eligible listings belonging to active Ploy Pro subscribers may receive enhanced placement
          in the marketplace and additional exposure in eligible AI Reports, along with a Ploy Pro
          badge.
        </p>
        <Callout title="Visibility is not a business outcome">
          <p>
            Increased visibility does not guarantee impressions, clicks, website traffic, enquiries,
            leads, customers, sales, conversions, revenue or any other business result. Ploy does
            not commit to a volume of traffic or to any level of marketplace performance, and does
            not guarantee that your listing will appear in any particular position or in any
            particular report.
          </p>
        </Callout>
        <p>
          Ploy Pro is billed as a subscription and may be cancelled at any time. Cancellation ends
          the visibility benefits; your listing remains on the marketplace as a standard listing.
        </p>
      </Section>

      <Section id="content-licence" number={10} heading="Your listing content">
        <p>
          You keep ownership of everything you submit. By submitting a listing you grant Ploy a
          non-exclusive, worldwide, royalty-free licence to host, display, reproduce and distribute
          that content for the purpose of operating and promoting the marketplace — including
          showing your listing in search results, category pages, AI Reports and roadmaps.
        </p>
        <p>
          This licence ends when your listing is removed, except for copies retained in backups, in
          reports already generated, or where Ploy must keep a record for legal or moderation
          purposes.
        </p>
      </Section>

      <Section id="termination" number={11} heading="Suspension and termination">
        <p>
          You may delete your listing at any time from your account. Ploy may suspend or remove a
          listing, or suspend an account, where these terms are breached or where a listing presents
          a risk to users.
        </p>
        <p>
          Where it is reasonable and lawful to do so, Ploy will tell you why a listing was rejected
          or removed and give you the opportunity to correct it and resubmit.
        </p>
      </Section>

      <Section id="changes" number={12} heading="Changes to these terms">
        <p>
          Ploy may update these terms. The version and date at the top of this page identify the
          current version. If the changes are material, Ploy will ask you to accept the updated
          terms before you next submit or update a listing.
        </p>
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ploy-gold underline-offset-4 hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
