import type { Metadata } from "next";
import Link from "next/link";
import { Callout, DraftNotice, LegalPage, List, Section, SubHeading } from "@/components/legal/legal-page";
import { LEGAL_VERSIONS, SUPPORT_EMAIL, SITE_DOMAIN } from "@/lib/legal/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Ploy — AI Reports, the AI employee marketplace, and Ploy Pro and Consulting Pro subscriptions.",
};

const SECTIONS = [
  { id: "introduction", heading: "Introduction" },
  { id: "eligibility", heading: "Eligibility" },
  { id: "accounts", heading: "Account registration" },
  { id: "security", heading: "Account security" },
  { id: "services", heading: "Ploy services" },
  { id: "ai-reports", heading: "AI Reports and recommendations" },
  { id: "roadmaps", heading: "Roadmaps and estimates" },
  { id: "marketplace", heading: "Marketplace and third-party providers" },
  { id: "user-responsibilities", heading: "Your responsibilities" },
  { id: "provider-responsibilities", heading: "Provider responsibilities" },
  { id: "prohibited", heading: "Prohibited conduct" },
  { id: "ip", heading: "Intellectual property" },
  { id: "third-party-sites", heading: "Third-party websites" },
  { id: "disclaimers", heading: "Disclaimers" },
  { id: "no-guarantees", heading: "No guarantees of results" },
  { id: "liability", heading: "Limitation of liability" },
  { id: "indemnification", heading: "Indemnification" },
  { id: "suspension", heading: "Suspension and termination" },
  { id: "subscriptions", heading: "Subscription terms" },
  { id: "cancellation", heading: "Cancellation and refunds" },
  { id: "service-changes", heading: "Changes to the service" },
  { id: "terms-changes", heading: "Changes to these terms" },
  { id: "disputes", heading: "Governing law and disputes" },
  { id: "contact", heading: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="September 16, 2026"
      version={LEGAL_VERSIONS.terms}
      sections={SECTIONS}
      intro={
        <p>
          These terms govern your use of Ploy. They explain what Ploy does, what it does not do, and
          what each of us is responsible for. Please read the sections on AI Reports, the
          marketplace, and guarantees carefully — they describe the limits of what Ploy can promise.
        </p>
      }
    >
      <DraftNotice />

      <Section id="introduction" number={1} heading="Introduction">
        <p>
          Ploy (&quot;Ploy&quot;, &quot;we&quot;, &quot;us&quot;) operates the website at {SITE_DOMAIN}{" "}
          and the services available through it (the &quot;Service&quot;). By creating an account or
          using the Service, you agree to these Terms of Service.
        </p>
        <p>
          Additional terms apply to specific parts of the Service and form part of these terms:{" "}
          <Link href="/ai-report-disclaimer" className="text-ploy-gold underline-offset-4 hover:underline">
            the AI Report Disclaimer
          </Link>{" "}
          and{" "}
          <Link href="/marketplace-provider-terms" className="text-ploy-gold underline-offset-4 hover:underline">
            the Marketplace Provider Terms
          </Link>
          . How we handle your information is described in the{" "}
          <Link href="/privacy" className="text-ploy-gold underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <p>If you do not agree to these terms, please do not use the Service.</p>
      </Section>

      <Section id="eligibility" number={2} heading="Eligibility">
        <p>By using Ploy you confirm that:</p>
        <List
          items={[
            "You are at least 18 years old.",
            "If you are using Ploy on behalf of a business, you are authorised to accept these terms for that business.",
            "You will use the Service only for lawful purposes and in line with these terms.",
            "You are not barred from using the Service under any applicable law or sanctions programme.",
          ]}
        />
      </Section>

      <Section id="accounts" number={3} heading="Account registration">
        <p>
          Some features require an account. You agree to provide accurate information when you
          register and to keep it up to date. Accounts are for a single user; do not share your
          login with others.
        </p>
        <p>
          You will be asked to verify your email address. Some features, including paid dashboards,
          require a verified email.
        </p>
        <p>
          When you create an account you are asked to accept these terms and acknowledge the Privacy
          Policy. Ploy records which version you accepted and when.
        </p>
      </Section>

      <Section id="security" number={4} heading="Account security">
        <p>
          You are responsible for keeping your password confidential and for activity that happens
          under your account. Choose a strong, unique password, and tell us promptly at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ploy-gold underline-offset-4 hover:underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          if you believe your account has been accessed without your permission.
        </p>
      </Section>

      <Section id="services" number={5} heading="Ploy services">
        <p>Ploy provides:</p>
        <List
          items={[
            "AI Reports — an automated analysis of information you provide about your business, producing readiness scores, identified bottlenecks, suggested AI employees and estimated impact.",
            "Implementation roadmaps — a sequenced 30-day, 90-day and one-year plan built from your report, available with a Ploy Pro subscription.",
            "The marketplace — a directory where businesses discover AI employees listed by independent third-party providers, and click through to those providers' own websites.",
            "Provider listings — the ability for a provider to submit one AI employee listing for review and, if approved, display on the marketplace.",
            "Consulting Pro — tools and training for independent consultants who help businesses adopt AI, including a client CRM and course material.",
          ]}
        />
        <Callout title="What Ploy is, and is not">
          <p>
            Ploy is a discovery, analysis and listing platform. Ploy does not build, operate, host,
            resell or support the AI employees in the marketplace; does not sell them or process
            payment for them; and is not a party to any agreement you make with a provider. Ploy
            does not charge providers a commission, referral fee or revenue share on sales.
          </p>
        </Callout>
      </Section>

      <Section id="ai-reports" number={6} heading="AI Reports and recommendations">
        <p>
          AI Reports are generated by Ploy&apos;s own automated scoring engine from two inputs: the
          information you enter, and the listings published on the marketplace when the report runs.
          They are informational and planning outputs.
        </p>
        <p>A report may include recommendations, estimates, potential savings, suggested workflows, suggested AI employees, implementation priorities and roadmaps. In every case:</p>
        <List
          items={[
            "A recommendation means a listing scored well against the information you supplied. It is not an endorsement, certification or finding of suitability.",
            "The quality of a report depends on the accuracy and completeness of what you enter. Ploy does not verify the information you provide.",
            "Reports reflect the marketplace at the time they are generated and may become out of date.",
            "Listings belonging to Ploy Pro subscribers may receive additional weighting and exposure, as disclosed wherever that benefit is described.",
          ]}
        />
        <p>
          The{" "}
          <Link href="/ai-report-disclaimer" className="text-ploy-gold underline-offset-4 hover:underline">
            AI Report Disclaimer
          </Link>{" "}
          sets this out in full and applies to every report.
        </p>
      </Section>

      <Section id="roadmaps" number={7} heading="Roadmaps and estimates">
        <p>
          Roadmaps sequence recommended workflows into a suggested plan with owners, dependencies,
          KPIs and estimated impact. Timelines, costs, potential savings and priorities are
          estimates produced from stated assumptions, not commitments, quotes or projections Ploy
          stands behind.
        </p>
        <p>
          Every numeric figure in a report or roadmap — including estimated savings, hours saved,
          ROI, monthly investment and revenue opportunity — is an estimate. Actual results will
          vary and may be materially different. Where there is not enough information to estimate
          something responsibly, the report says so instead of producing a number.
        </p>
        <p>
          Reports and roadmaps are not business, financial, investment, legal, tax, security or
          technical advice.
        </p>
      </Section>

      <Section id="marketplace" number={8} heading="Marketplace and third-party providers">
        <p>
          AI employees listed on Ploy are offered by independent third-party providers. Ploy does
          not develop, operate, control, test or guarantee those products and services.
        </p>
        <p>
          When you select an AI employee you are directed to the provider&apos;s own website. Any
          purchase, subscription, agreement or relationship you enter into with a provider is
          between you and that provider, on their terms, with their pricing, and subject to their
          privacy and security practices. Ploy is not a party to it and cannot resolve disputes
          arising from it.
        </p>
        <SubHeading>What marketplace approval means</SubHeading>
        <p>
          Every listing is reviewed before it appears on the marketplace, and edits to an approved
          listing return it to review. Approval means the listing has been reviewed for inclusion on
          Ploy. It does not mean Ploy has verified the provider&apos;s claims, tested the product,
          audited its security, or that Ploy guarantees its performance, security, results or
          suitability.
        </p>
        <p>
          Some listings display figures supplied by the provider, such as a stated average ROI or
          expected monthly savings. Those are provider-reported and attributed to the provider, not
          verified or adopted by Ploy.
        </p>
        <p>
          If you believe a listing is misleading, fraudulent or inaccurate, you can report it from
          the listing page. Ploy reviews reports and may act on them, but a report is an allegation
          rather than a finding.
        </p>
      </Section>

      <Section id="user-responsibilities" number={9} heading="Your responsibilities">
        <p>When using Ploy you agree to:</p>
        <List
          items={[
            "Provide accurate information in your account and in any report you generate.",
            "Independently evaluate any provider, product, pricing, capability, security practice and privacy practice before purchasing or implementing anything.",
            "Read a provider's own terms and privacy policy before entering into an agreement with them.",
            "Make your own decisions about what to implement, and take responsibility for those decisions.",
            "Comply with the laws and regulations that apply to your business and your use of AI.",
          ]}
        />
      </Section>

      <Section id="provider-responsibilities" number={10} heading="Provider responsibilities">
        <p>
          If you list an AI employee on Ploy, the{" "}
          <Link
            href="/marketplace-provider-terms"
            className="text-ploy-gold underline-offset-4 hover:underline"
          >
            Marketplace Provider Terms
          </Link>{" "}
          apply in addition to these terms. In summary, providers are responsible for their
          products, their claims, their pricing, their customers, their support, their agreements,
          their privacy and security practices, and their fulfilment. Providers must have the right
          to list what they list, must keep listings accurate, and must not make unsupported
          guarantees.
        </p>
      </Section>

      <Section id="prohibited" number={11} heading="Prohibited conduct">
        <p>You must not:</p>
        <List
          items={[
            "Use the Service for any unlawful purpose or in breach of any regulation",
            "Impersonate any person or business, or misrepresent your affiliation with one",
            "Upload or transmit malware or malicious code, or attempt to interfere with the Service",
            "Attempt to gain unauthorised access to accounts, systems, data or administrative functions",
            "Scrape, crawl or harvest data from the Service, or use it to build a competing dataset",
            "Submit fraudulent listings, fake reviews or manipulated ratings",
            "Attempt to manipulate marketplace ranking or which listings AI Reports recommend",
            "Send spam or unsolicited commercial messages to Ploy users",
            "Infringe anyone's intellectual property or privacy rights",
            "Resell, sublicense or redistribute the Service or its content without permission",
          ]}
        />
      </Section>

      <Section id="ip" number={12} heading="Intellectual property">
        <p>
          The Service, its software, design, scoring methodology and original content are owned by
          Ploy and protected by intellectual property laws. You may not copy, modify, distribute or
          create derivative works from them except as the Service expressly allows.
        </p>
        <p>
          You keep ownership of the content you submit — your business information, report inputs,
          listing content and uploaded images. You grant Ploy a non-exclusive, worldwide,
          royalty-free licence to host, process and display that content as needed to operate and
          improve the Service, including generating your reports and displaying your listing.
        </p>
        <p>
          Reports generated for you are yours to use within your business. The underlying analysis
          and the Service itself remain Ploy&apos;s.
        </p>
      </Section>

      <Section id="third-party-sites" number={13} heading="Third-party websites">
        <p>
          The Service links to websites Ploy does not control, including provider websites. Ploy is
          not responsible for their content, products, accuracy, security, availability, terms or
          privacy practices, and linking to a site is not an endorsement of it. Your use of a
          third-party site is governed by that site&apos;s own terms.
        </p>
      </Section>

      <Section id="disclaimers" number={14} heading="Disclaimers">
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the
          fullest extent permitted by law, Ploy disclaims all warranties, whether express or
          implied, including implied warranties of merchantability, fitness for a particular purpose
          and non-infringement.
        </p>
        <p>In particular, Ploy does not warrant:</p>
        <List
          items={[
            "That listings, provider claims, ratings or reviews are accurate or complete",
            "The quality, reliability, security or safety of any third-party AI employee or service",
            "That the Service will be uninterrupted, timely, error-free or free of harmful components",
            "That any recommendation, estimate, roadmap or projection will prove accurate",
            "That defects in the Service will be corrected",
          ]}
        />
        <p>
          Nothing in these terms excludes or limits any liability that cannot lawfully be excluded
          or limited, and some jurisdictions do not allow certain exclusions — in which case the
          exclusions above apply only to the extent permitted.
        </p>
      </Section>

      <Section id="no-guarantees" number={15} heading="No guarantees of results">
        <p>
          Ploy does not guarantee any business outcome. Specifically, and without limitation, Ploy
          does not guarantee:
        </p>
        <List
          items={[
            "Revenue increases, sales, leads, conversions, customers or business growth",
            "Cost savings, hours saved, productivity improvements or return on investment",
            "That a recommended AI employee, workflow, provider or strategy will suit your business",
            "That any third-party product will perform as described",
            "That an implementation will succeed, or succeed within an estimated timeframe",
            "For providers: impressions, clicks, website traffic, enquiries, leads, sales, conversions or revenue from a listing, including a Ploy Pro listing",
          ]}
        />
        <p>
          Increased marketplace visibility through Ploy Pro is a change in placement and exposure
          only. It is not a commitment to deliver any level of traffic or any business result.
        </p>
      </Section>

      <Section id="liability" number={16} heading="Limitation of liability">
        <p>To the fullest extent permitted by law:</p>
        <List
          items={[
            "Ploy is not liable for indirect, incidental, special, consequential, exemplary or punitive damages.",
            "Ploy is not liable for lost profits, lost revenue, lost data, lost business opportunities, or the cost of substitute services, however caused.",
            "Ploy is not liable for the acts, omissions, products, services or content of third-party providers, or for any agreement between you and a provider.",
            "Ploy's total aggregate liability arising out of or relating to the Service is limited to the greater of the amounts you paid Ploy in the twelve months before the event giving rise to the claim, or USD $100.",
          ]}
        />
        <p>
          These limits apply regardless of the legal theory — contract, tort, negligence, statute or
          otherwise — and even if Ploy has been advised that such damages are possible. They do not
          apply to liability that cannot lawfully be limited, such as liability for fraud or for
          death or personal injury caused by negligence.
        </p>
      </Section>

      <Section id="indemnification" number={17} heading="Indemnification">
        <p>
          You agree to indemnify and hold harmless Ploy and its officers, directors, employees and
          agents from claims, damages, losses and reasonable expenses (including legal fees) arising
          from:
        </p>
        <List
          items={[
            "Your breach of these terms or of any additional terms that apply to you",
            "Content you submit, including a listing you publish",
            "Your infringement of a third party's rights",
            "Your breach of any applicable law or regulation",
            "For providers: your product, your claims about it, and your dealings with your customers",
          ]}
        />
      </Section>

      <Section id="suspension" number={18} heading="Suspension and termination">
        <p>
          You may stop using the Service at any time. Ploy may suspend or terminate an account or
          remove content where these terms are breached, where activity is fraudulent or unlawful,
          where the Service is being abused, or where fees are unpaid.
        </p>
        <p>
          Where it is reasonable and lawful to do so, Ploy will give notice and an opportunity to
          put things right before suspending or terminating an account. On termination, your right
          to use the Service ends. Sections that by their nature should survive — including
          intellectual property, disclaimers, liability limits and indemnification — survive.
        </p>
      </Section>

      <Section id="subscriptions" number={19} heading="Subscription terms">
        <p>Ploy offers two paid subscriptions, each billed separately:</p>
        <List
          items={[
            <>
              <strong className="text-foreground">Ploy Pro</strong> — for businesses and providers.
              Includes unlimited AI Reports, the full set of report recommendations, the detailed
              implementation roadmap, and enhanced marketplace visibility for an approved listing.
            </>,
            <>
              <strong className="text-foreground">Consulting Pro</strong> — for independent
              consultants. Includes the consultant dashboard, client CRM and training material.
            </>,
          ]}
        />
        <p>
          Current prices are shown on the pricing pages and at checkout, and are the prices that
          apply. Subscriptions are billed monthly in advance through Stripe, our payment processor,
          and renew automatically each billing period until cancelled. Ploy does not receive or
          store your full card details.
        </p>
        <p>
          Owning one subscription does not include the other. If a payment fails, the subscription
          is marked past due and you will be notified so you can update your payment method; paid
          features may be unavailable until payment succeeds. If a subscription ends or lapses, the
          features it unlocked — including the saved roadmap and Ploy Pro listing visibility —
          become unavailable, though your underlying data is not deleted for that reason alone.
        </p>
        <p>
          Ploy may change subscription pricing. Existing subscribers will be given reasonable advance
          notice before a price change takes effect on their subscription, and may cancel before it
          does.
        </p>
      </Section>

      <Section id="cancellation" number={20} heading="Cancellation and refunds">
        <p>
          You can cancel at any time from <strong className="text-foreground">Account → Billing</strong>,
          using <strong className="text-foreground">Manage Subscription</strong> to open the Stripe
          billing portal.
        </p>
        <p>
          Cancellation takes effect at the end of the billing period you have already paid for. You
          keep access to paid features until then, and you are not billed again.
        </p>
        <Callout title="Refunds">
          <p>
            Payments are generally non-refundable, including for partial billing periods and for
            periods where a paid feature was not used. Ploy does not currently operate an automated
            refund process.
          </p>
          <p>
            If you believe you have been charged in error, or you have a refund request, contact{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ploy-gold underline-offset-4 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            . Requests are considered individually. Nothing here limits refund or cancellation
            rights you have under consumer law in your jurisdiction, which apply regardless of this
            section.
          </p>
        </Callout>
      </Section>

      <Section id="service-changes" number={21} heading="Changes to the service">
        <p>
          Ploy is under active development. Features may be added, changed or removed, and the
          marketplace catalogue changes as listings are added, updated and removed. Ploy will try to
          avoid disruptive changes to paid features without notice, but does not guarantee that any
          particular feature will remain available.
        </p>
      </Section>

      <Section id="terms-changes" number={22} heading="Changes to these terms">
        <p>
          Ploy may update these terms. The version identifier and date at the top of this page
          always show the current version, and Ploy keeps a record of which version each user
          accepted.
        </p>
        <p>
          For material changes, Ploy will give notice — by email, by notice in the Service, or by
          asking you to accept the updated terms — before they take effect for you. Continuing to
          use the Service after a change takes effect means you accept the updated terms. If you do
          not accept them, you should stop using the Service and may cancel any subscription.
        </p>
      </Section>

      <Section id="disputes" number={23} heading="Governing law and disputes">
        <p>
          These terms are governed by the laws of the State of Delaware, United States, without
          regard to its conflict of laws rules. You and Ploy agree to the exclusive jurisdiction of
          the state and federal courts located in Delaware, except where mandatory law in your
          country of residence gives you the right to bring proceedings elsewhere.
        </p>
        <p>
          Before starting formal proceedings, please contact{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ploy-gold underline-offset-4 hover:underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          so we can try to resolve the issue directly.
        </p>
        <p>
          If any provision of these terms is found unenforceable, the rest remain in effect. Ploy&apos;s
          failure to enforce a provision is not a waiver of it. These terms, together with the
          documents they reference, are the entire agreement between you and Ploy regarding the
          Service.
        </p>
      </Section>

      <Section id="contact" number={24} heading="Contact">
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ploy-gold underline-offset-4 hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <p className="text-xs">
          {/* The operating entity's registered address belongs here once confirmed. */}
          Registered business name and postal address to be added before publication.
        </p>
      </Section>
    </LegalPage>
  );
}
