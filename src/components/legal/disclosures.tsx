import Link from "next/link";
import { Info, ExternalLink, Star } from "lucide-react";
import { DISCLOSURES } from "@/lib/legal/constants";

/**
 * The short contextual disclosures, rendered next to the feature they describe
 * rather than only in the legal documents. Kept visually quiet — the point is
 * that a reader sees them at the moment of the decision, not that they
 * dominate the page.
 */

function Note({
  icon,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-2.5 rounded-xl border border-border bg-secondary/20 p-3.5 text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      <span className="mt-0.5 shrink-0 text-muted-foreground/70">{icon}</span>
      <p>{children}</p>
    </div>
  );
}

function LearnMore({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap font-medium text-ploy-gold underline-offset-4 hover:underline"
    >
      Learn more
    </Link>
  );
}

/** Sits directly under the recommended AI tools in an AI Report. */
export function AiReportDisclosure({ className = "" }: { className?: string }) {
  return (
    <Note icon={<Info className="h-3.5 w-3.5" />} className={className}>
      <span className="font-medium text-foreground">AI-generated recommendations.</span>{" "}
      {DISCLOSURES.aiReport} <LearnMore href="/ai-report-disclaimer" />
    </Note>
  );
}

/** Sits with the estimate tiles (savings, hours, ROI) at the top of a report. */
export function EstimatesDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      {DISCLOSURES.aiReportEstimates}{" "}
      <LearnMore href="/ai-report-disclaimer" />
    </p>
  );
}

/** Sits at the top of the Ploy Pro implementation roadmap. */
export function RoadmapDisclosure({ className = "" }: { className?: string }) {
  return (
    <Note icon={<Info className="h-3.5 w-3.5" />} className={className}>
      <span className="font-medium text-foreground">Roadmap disclaimer.</span>{" "}
      {DISCLOSURES.roadmap} <LearnMore href="/ai-report-disclaimer" />
    </Note>
  );
}

/** Sits next to the primary CTA on a marketplace listing detail page. */
export function MarketplaceListingDisclosure({ className = "" }: { className?: string }) {
  return (
    <Note icon={<ExternalLink className="h-3.5 w-3.5" />} className={className}>
      <span className="font-medium text-foreground">Third-party product.</span>{" "}
      {DISCLOSURES.marketplaceListing} <LearnMore href="/marketplace-provider-terms" />
    </Note>
  );
}

/** Sits above the marketplace results grid. */
export function MarketplaceBrowseDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      {DISCLOSURES.marketplaceBrowse} <LearnMore href="/terms#marketplace" />
    </p>
  );
}

/**
 * Shown wherever Ploy Pro listing visibility is described — the pricing pages,
 * the listing form, and the provider's own listing dashboard.
 */
export function ProVisibilityDisclosure({ className = "" }: { className?: string }) {
  return (
    <Note icon={<Star className="h-3.5 w-3.5" />} className={className}>
      <span className="font-medium text-foreground">Ploy Pro visibility.</span>{" "}
      {DISCLOSURES.ployProVisibility} <LearnMore href="/terms#no-guarantees" />
    </Note>
  );
}

/** Explains what a marketplace approval badge does and does not mean. */
export function ApprovalMeaningDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      {DISCLOSURES.marketplaceApproval}
    </p>
  );
}

/**
 * Sits at the top of a consultant resource that a reader could mistake for a
 * legal document — the proposal template in particular, which ends by telling
 * them to sign an agreement Ploy does not supply.
 */
export function ConsultantTemplateDisclosure({ className = "" }: { className?: string }) {
  return (
    <Note icon={<Info className="h-3.5 w-3.5" />} className={className}>
      <span className="font-medium text-foreground">Template, not legal advice.</span>{" "}
      {DISCLOSURES.consultantTemplate}
    </Note>
  );
}
