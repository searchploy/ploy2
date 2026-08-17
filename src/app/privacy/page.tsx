import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container max-w-2xl py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated July 2026</p>
      <div className="prose prose-neutral mt-8 max-w-none text-muted-foreground">
        <p>
          Ploy, Inc. (&quot;Ploy&quot;, &quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what information we collect
          when you use the Ploy marketplace, how we use it, and the choices you have.
        </p>
        <h2 className="text-foreground">Information we collect</h2>
        <p>
          We collect account information (name, email, company), usage data (pages viewed, searches, demo
          requests), and transaction data (orders placed through the marketplace).
        </p>
        <h2 className="text-foreground">How we use it</h2>
        <p>
          We use this information to operate the marketplace, facilitate transactions between businesses and
          agencies, personalize recommendations, and improve Ploy.
        </p>
        <h2 className="text-foreground">Contact</h2>
        <p>Questions about this policy can be sent to privacy@ploy.com.</p>
      </div>
    </div>
  );
}
