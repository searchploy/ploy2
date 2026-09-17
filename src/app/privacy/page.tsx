import type { Metadata } from "next";
import Link from "next/link";
import { Callout, DraftNotice, LegalPage, List, Section, SubHeading } from "@/components/legal/legal-page";
import { LEGAL_VERSIONS, SUPPORT_EMAIL } from "@/lib/legal/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What information Ploy collects, how it is used, who processes it, and the choices you have.",
};

const SECTIONS = [
  { id: "introduction", heading: "Introduction" },
  { id: "what-we-collect", heading: "Information we collect" },
  { id: "how-we-use", heading: "How we use information" },
  { id: "ai-processing", heading: "AI Reports and automated analysis" },
  { id: "providers", heading: "Service providers we use" },
  { id: "sharing", heading: "When information is shared" },
  { id: "cookies", heading: "Cookies and tracking" },
  { id: "retention", heading: "How long we keep information" },
  { id: "security", heading: "Security" },
  { id: "your-rights", heading: "Your choices and rights" },
  { id: "deletion", heading: "Deleting your account" },
  { id: "children", heading: "Children" },
  { id: "international", heading: "International transfers" },
  { id: "changes", heading: "Changes to this policy" },
  { id: "contact", heading: "Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 16, 2026"
      version={LEGAL_VERSIONS.privacy}
      sections={SECTIONS}
      intro={
        <p>
          This policy describes what information Ploy collects, why, and who else processes it. It
          describes the Service as it actually works today — where something is not implemented yet,
          this policy says so rather than describing an intention.
        </p>
      }
    >
      <DraftNotice />

      <Section id="introduction" number={1} heading="Introduction">
        <p>
          Ploy (&quot;Ploy&quot;, &quot;we&quot;, &quot;us&quot;) provides AI Reports, an AI employee
          marketplace, and subscription tools for businesses and consultants. This policy applies to
          information we handle through the Ploy website and Service.
        </p>
        <p>
          It does not apply to third-party provider websites. When you click through to a provider,
          that provider&apos;s own privacy policy governs what they collect. See the{" "}
          <Link href="/terms" className="text-ploy-gold underline-offset-4 hover:underline">
            Terms of Service
          </Link>{" "}
          for how that relationship works.
        </p>
      </Section>

      <Section id="what-we-collect" number={2} heading="Information we collect">
        <SubHeading>Information you give us</SubHeading>
        <List
          items={[
            <>
              <strong className="text-foreground">Account information</strong> — your name, email
              address, the account type you select, and company name where the account type asks for
              one. Your password is handled by our authentication provider and is stored hashed;
              Ploy never sees it.
            </>,
            <>
              <strong className="text-foreground">AI Report inputs</strong> — everything you enter in
              the report questionnaire: business name, website, industry, description, employee
              count, revenue range, departments, current software, pain points and goals.
            </>,
            <>
              <strong className="text-foreground">Generated reports and roadmaps</strong> — the
              scores, bottlenecks, recommendations, estimates and roadmap produced from your inputs.
            </>,
            <>
              <strong className="text-foreground">Marketplace listing information</strong> — if you
              list an AI employee: the listing name, category, tagline, description, tasks,
              industries, pricing, agency name, website URL and any logo image you upload.
            </>,
            <>
              <strong className="text-foreground">Demo and contact requests</strong> — your name,
              email, company and message when you request a demo for a listing.
            </>,
            <>
              <strong className="text-foreground">Consultant CRM data</strong> — if you use
              Consulting Pro, the client and prospect records you create, including the business
              name, contact name, email, phone, deal value, stage and notes you enter about them.
            </>,
            <>
              <strong className="text-foreground">Saved items</strong> — listings you favourite.
            </>,
            <>
              <strong className="text-foreground">Listing reports</strong> — if you report a listing:
              the reason you select and any detail you write.
            </>,
            <>
              <strong className="text-foreground">Support correspondence</strong> — messages you send
              us by email.
            </>,
          ]}
        />

        <Callout title="About the information you enter into a report">
          <p>
            Report inputs are free-text and structured answers about your business. Please do not
            enter personal information about named individuals, customer records, credentials, or
            confidential third-party information — none of it is needed to generate a report.
          </p>
          <p>
            If you use the consultant CRM, you are entering information about other people. You are
            responsible for having a lawful basis to do so and for telling those people as your own
            privacy obligations require.
          </p>
        </Callout>

        <SubHeading>Information created by using the Service</SubHeading>
        <List
          items={[
            <>
              <strong className="text-foreground">Subscription and billing records</strong> — your
              subscription type, status, billing period and the customer and subscription
              identifiers issued by Stripe, plus invoice and charge records. Ploy does not receive or
              store your full card number.
            </>,
            <>
              <strong className="text-foreground">Legal acceptance records</strong> — which version of
              our legal documents you accepted and when.
            </>,
            <>
              <strong className="text-foreground">Security events</strong> — a log of
              security-relevant actions such as listing approvals, rejections, deletions and refused
              attempts, recording who acted, on what, and the outcome. It deliberately excludes
              passwords, tokens, session data and payment details.
            </>,
            <>
              <strong className="text-foreground">Rate-limiting counters</strong> — short-lived counts
              used to stop automated abuse of report generation and listing reports.
            </>,
            <>
              <strong className="text-foreground">Notifications</strong> — in-app messages we generate
              for you, such as a failed payment notice.
            </>,
          ]}
        />

        <SubHeading>Information we do not collect</SubHeading>
        <p>
          To be specific about what is not happening: Ploy does not currently run product analytics,
          advertising pixels, marketing trackers or third-party tracking cookies, does not build
          advertising profiles, does not buy personal data from data brokers, and does not sell
          personal information. Ploy does not offer social or single sign-on login, so we receive no
          data from such providers.
        </p>
        <p>
          Ploy&apos;s own application code does not record your IP address or browsing history.
          However, the infrastructure providers listed below necessarily process network information
          such as IP addresses to deliver, secure and operate the Service.
        </p>
      </Section>

      <Section id="how-we-use" number={3} heading="How we use information">
        <p>We use the information described above to:</p>
        <List
          items={[
            "Create and authenticate your account, and verify your email address",
            "Generate your AI Reports, recommendations and implementation roadmaps",
            "Operate the marketplace, including displaying approved listings and matching them to reports",
            "Review listings submitted for moderation, and act on reports about listings",
            "Process subscriptions, billing and access to paid features",
            "Send service messages such as email verification, password resets and payment notices",
            "Respond to support requests",
            "Detect, investigate and prevent fraud, abuse, spam and security incidents",
            "Keep records of legal document acceptance",
            "Meet legal, tax and accounting obligations",
            "Fix problems and improve how the Service works",
          ]}
        />
        <p>
          Ploy does not currently send marketing or promotional email. The preference toggles in
          Account → Settings are not yet connected to a live email system; if we introduce marketing
          email, we will honour those preferences and include an unsubscribe link.
        </p>
      </Section>

      <Section id="ai-processing" number={4} heading="AI Reports and automated analysis">
        <Callout title="Your business information is not sent to a third-party AI model">
          <p>
            Despite the name, AI Reports are produced by Ploy&apos;s own scoring engine running on
            Ploy&apos;s infrastructure. It applies a fixed set of rules and weightings to the
            answers you give and to the published marketplace listings.
          </p>
          <p>
            Ploy does not send your report inputs, your business information or your roadmap to
            OpenAI, Anthropic, Google or any other external AI or large language model provider, and
            does not use your information to train any AI model.
          </p>
        </Callout>
        <p>
          Your report inputs and the generated report are stored in Ploy&apos;s database so you can
          return to the report, and so a Ploy Pro roadmap can be rebuilt. A report generated without
          an account is stored without being linked to any user, and is reachable only by its unique
          link.
        </p>
        <p>
          Because reports are generated automatically, no decision with legal or similarly
          significant effect is made about you by this processing — a report is information you
          choose what to do with.
        </p>
      </Section>

      <Section id="providers" number={5} heading="Service providers we use">
        <p>
          Ploy is built on a small number of infrastructure providers, each of which processes some
          data on our behalf:
        </p>
        <List
          items={[
            <>
              <strong className="text-foreground">Supabase</strong> — database, authentication and
              file storage. Holds your account, business information, reports, listings, uploaded
              logos and the other records described above, and sends authentication emails such as
              verification codes and password resets.
            </>,
            <>
              <strong className="text-foreground">Stripe</strong> — payment processing and
              subscription billing. Stripe collects and processes your payment details directly;
              Ploy receives identifiers, subscription status and invoice records, not your full card
              details.
            </>,
            <>
              <strong className="text-foreground">Vercel</strong> — application hosting and content
              delivery. Processes network and request information, including IP addresses, in the
              course of serving the site.
            </>,
            <>
              <strong className="text-foreground">Cloudflare</strong> — the Turnstile anti-bot check
              on our sign-up and authentication forms. Turnstile processes device and network
              signals to distinguish people from automated scripts.
            </>,
          ]}
        />
        <p>
          These providers act as our processors and are permitted to use the information only to
          provide their service to us. Each has its own privacy and security documentation.
        </p>
      </Section>

      <Section id="sharing" number={6} heading="When information is shared">
        <p>
          Ploy does not sell personal information and does not share it for third-party advertising.
          Information is shared only in these situations:
        </p>
        <List
          items={[
            "With the service providers listed above, to operate the Service.",
            "Publicly, for content you choose to publish — an approved marketplace listing is public, including its name, description, pricing, agency name, website and logo. Your account identifier is deliberately stripped before listing data is sent to the browser.",
            "With a provider you contact — if you submit a demo request, the details you enter are made available so the request can be answered.",
            "With Ploy administrators, who can access account, listing, report and moderation records in order to run and moderate the platform.",
            "Where required by law — to comply with a legal obligation, court order or valid government request, or to establish, exercise or defend legal claims.",
            "To protect safety and rights — to investigate fraud, abuse or security incidents, or to protect Ploy, our users or the public.",
            "In a business transfer — if Ploy is involved in a merger, acquisition or sale of assets, information may transfer as part of that transaction. We would give notice before your information became subject to a different privacy policy.",
          ]}
        />
        <p>
          Listing reports are visible only to the person who filed them and to Ploy administrators.
          They are not shown to the provider being reported or to other users.
        </p>
      </Section>

      <Section id="cookies" number={7} heading="Cookies and tracking">
        <p>
          Ploy uses cookies that are necessary for the Service to function. In practice this means
          authentication and session cookies set by our authentication provider, which keep you
          signed in as you move between pages, and the cookies Cloudflare Turnstile needs to run its
          anti-bot check.
        </p>
        <p>
          Ploy does not currently use analytics cookies, advertising cookies, marketing pixels or
          cross-site tracking. Because only strictly necessary cookies are in use, the Service does
          not show a consent banner. If that changes, we will introduce appropriate consent controls
          before setting non-essential cookies.
        </p>
        <p>
          Blocking essential cookies in your browser will prevent you from signing in.
        </p>
      </Section>

      <Section id="retention" number={8} heading="How long we keep information">
        <p>
          We keep information for as long as your account is active and for as long as we need it
          for the purposes described in this policy.
        </p>
        <List
          items={[
            "Account, business, report, roadmap and listing data is kept while your account exists.",
            "Deleting a listing removes it and its dependent records — favourites, report references, reviews and demo requests tied to it.",
            "Billing and transaction records are kept for as long as required for tax, accounting and audit purposes, which is typically several years and is determined by law rather than by us.",
            "Legal acceptance records are kept as a durable record of what was agreed and are not deleted while the account exists.",
            "Security event logs are kept so incidents can be investigated and reconstructed.",
            "Reports generated without an account are retained but are not linked to any person.",
          ]}
        />
        <p>
          We have not yet set fixed retention periods for every category. Where we cannot state a
          precise period, we keep information only as long as it is needed for the purpose it was
          collected for.
        </p>
      </Section>

      <Section id="security" number={9} heading="Security">
        <p>Measures currently in place include:</p>
        <List
          items={[
            "Encryption in transit (HTTPS/TLS) across the Service",
            "Passwords stored hashed by our authentication provider, with minimum strength rules enforced",
            "Row-level security in the database, so records are restricted to the account that owns them and to administrators",
            "Server-side authorisation checks on paid features and administrative actions, rather than relying on the browser",
            "An anti-bot check on sign-up, and rate limiting on report generation and listing reports",
            "Logging of security-relevant administrative actions, including refused attempts",
            "Payment card details handled by Stripe and never stored on Ploy's systems",
          ]}
        />
        <p>
          No service can promise perfect security. We cannot and do not guarantee that information
          will never be accessed, disclosed, altered or destroyed without authorisation. If we
          become aware of a breach affecting your information, we will act on it and notify you and
          any regulator where the law requires.
        </p>
      </Section>

      <Section id="your-rights" number={10} heading="Your choices and rights">
        <p>
          Depending on where you live, you may have rights over your personal information — commonly
          including the right to access a copy, correct inaccurate information, request deletion,
          object to or restrict processing, and receive your data in a portable format. Residents of
          the European Economic Area, the United Kingdom, California and several other jurisdictions
          have specific statutory rights; which ones apply to you depends on your location and the
          law in force there.
        </p>
        <p>
          You can update your name and account details directly in Account → Profile, and you can
          edit or delete your marketplace listing at any time from Account → My Listing.
        </p>
        <p>
          For anything else — a copy of your data, a correction you cannot make yourself, deletion,
          or an objection — email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ploy-gold underline-offset-4 hover:underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          with &quot;Privacy request&quot; in the subject line. We will verify that the request comes
          from you and respond within the time the applicable law allows. We will not discriminate
          against you for exercising these rights.
        </p>
        <p>
          Ploy does not sell or share personal information for cross-context behavioural
          advertising, so there is nothing to opt out of in that respect.
        </p>
      </Section>

      <Section id="deletion" number={11} heading="Deleting your account">
        <Callout title="Account deletion is handled by request">
          <p>
            Self-service account deletion is not currently functional. Please do not rely on the
            delete button in Account → Settings; it does not complete the deletion.
          </p>
          <p>
            To delete your account, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ploy-gold underline-offset-4 hover:underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            from the address on the account with &quot;Delete my account&quot; in the subject line.
            We will verify the request and confirm when it is done.
          </p>
        </Callout>
        <p>When an account is deleted:</p>
        <List
          items={[
            "Your profile and the records linked to it — reports, roadmaps, saved items, listing and CRM records — are removed.",
            "Your marketplace listing is removed from the marketplace.",
            "Any active subscription should be cancelled first, through Account → Billing, so it does not continue to bill.",
            "Billing and transaction records are retained where tax, accounting or audit law requires it.",
            "Some information may persist temporarily in backups until those backups age out.",
          ]}
        />
      </Section>

      <Section id="children" number={12} heading="Children">
        <p>
          Ploy is a business tool intended for people aged 18 and over, and is not directed at
          children. We do not knowingly collect personal information from anyone under 18. If you
          believe a child has given us personal information, contact us and we will delete it.
        </p>
      </Section>

      <Section id="international" number={13} heading="International transfers">
        <p>
          Ploy and its service providers operate internationally, and your information may be
          stored and processed in countries other than where you live — including the United States
          — where data protection law may differ from your own.
        </p>
        <p>
          Where information is transferred out of the European Economic Area or the United Kingdom,
          we rely on our providers&apos; transfer mechanisms, such as Standard Contractual Clauses.
          Our formal transfer documentation is still being finalised; if you need specifics for your
          own compliance assessment, contact us.
        </p>
      </Section>

      <Section id="changes" number={14} heading="Changes to this policy">
        <p>
          We may update this policy as the Service changes. The version identifier and date at the
          top of this page always show the current version. For material changes we will give notice
          in the Service or by email before they take effect.
        </p>
      </Section>

      <Section id="contact" number={15} heading="Contact">
        <p>
          Privacy questions and requests:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ploy-gold underline-offset-4 hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <p className="text-xs">
          {/* Required in several jurisdictions once the operating entity is confirmed. */}
          Registered business name, postal address and (where required) EU/UK representative details
          to be added before publication.
        </p>
      </Section>
    </LegalPage>
  );
}
