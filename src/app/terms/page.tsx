import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container max-w-2xl py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated July 2026</p>
      <div className="prose prose-neutral mt-8 max-w-none text-muted-foreground">
        <p>
          These Terms govern your use of Ploy, a marketplace connecting businesses with AI agencies that build and
          support AI employees.
        </p>
        <h2 className="text-foreground">Marketplace role</h2>
        <p>
          Ploy is a discovery and comparison platform only — it does not process payments, host checkout, or
          perform implementation. Businesses that find an agency on Ploy sign up and transact directly on the
          agency&apos;s own website. Agencies are solely responsible for building, implementing, and supporting the
          AI employees they list. Ploy collects a referral commission from the agency on sales that result from
          a Ploy referral, as disclosed in each agency&apos;s listing agreement.
        </p>
        <h2 className="text-foreground">Accounts</h2>
        <p>
          You must provide accurate information when creating an account and are responsible for activity under
          your account.
        </p>
        <h2 className="text-foreground">Contact</h2>
        <p>Questions about these Terms can be sent to legal@ploy.com.</p>
      </div>
    </div>
  );
}
