import type { Metadata } from "next";
import { MarketplaceBrowser } from "@/components/marketplace/marketplace-browser";
import {
  getLivePublishedEmployees,
  getLiveCategories,
  getLiveAgencies,
  getReportRecommendedEmployeeIds,
} from "@/lib/data/live-marketplace";
import { employees as mockExternalProviders } from "@/lib/data/employees";
import { agencies as mockAgencies } from "@/lib/data/agencies";

export const metadata: Metadata = {
  title: "AI Employee Marketplace",
  description:
    "Find AI employees for your business by the problem you want to solve. Compare solutions and go straight to the agency behind them.",
};

// A newly published listing must appear immediately. Without this the page is
// prerendered at build time, so listings created after a deploy never show up.
export const dynamic = "force-dynamic";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; from_report?: string }>;
}) {
  const { category, from_report: fromReport } = await searchParams;

  const [liveEmployees, categories, liveAgencies, matchedIds] = await Promise.all([
    getLivePublishedEmployees(),
    getLiveCategories(),
    getLiveAgencies(),
    fromReport
      ? getReportRecommendedEmployeeIds(fromReport)
      : Promise.resolve(new Set<string>()),
  ]);

  // Merge live Supabase employees with mock external provider employees
  // External providers are the last 30 employees in the mock data
  const externalProviderEmployees = mockExternalProviders.slice(-30);
  const employees = [...liveEmployees, ...externalProviderEmployees];

  // Merge live agencies with mock external provider agencies
  // External provider agencies are the last 14 agencies in the mock data
  const externalProviderAgencies = mockAgencies.slice(-14);
  const agencies = [...liveAgencies, ...externalProviderAgencies];

  return (
    <div className="container py-12">
      <div className="mb-10 flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          AI Employee Marketplace
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Find the right AI employee for your business. Filter by the problem you&apos;re solving,
          then head to the agency&apos;s site to get started.
        </p>
      </div>

      <MarketplaceBrowser
        employees={employees}
        categories={categories}
        agencies={agencies}
        initialCategory={category}
        matchedIds={matchedIds}
      />
    </div>
  );
}
