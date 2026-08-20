"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LiveEmployeeCard } from "@/components/marketplace/live-employee-card";
import type { EmployeeWithCategory } from "@/lib/data/live-marketplace";
import type { Agency, Category } from "@/lib/types/database";

type SortKey = "recommended" | "highest-rated" | "most-popular" | "price-low" | "price-high" | "newest";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "highest-rated", label: "Highest Rated" },
  { value: "most-popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

/**
 * Role groupings. Listing roles are supplier-entered free text ("Bookkeeper",
 * "Customer Support Specialist", "Lead generation"), so each bucket matches on
 * substrings rather than equality. Buckets that match nothing in the current
 * catalog are hidden, so the panel never offers a filter that returns nothing.
 */
const ROLE_BUCKETS: { label: string; match: string[] }[] = [
  { label: "Sales Representative", match: ["sales", "account executive", "closer"] },
  { label: "SDR / Lead Generation", match: ["sdr", "lead gen", "lead generation", "prospect", "outbound"] },
  { label: "Customer Support", match: ["support", "customer service", "receptionist", "help desk"] },
  { label: "Marketing", match: ["marketing", "seo", "social media", "growth"] },
  { label: "Content Creator", match: ["content", "writer", "copywriter", "blog"] },
  { label: "Recruiter", match: ["recruit", "talent", "hiring", "sourcing"] },
  { label: "Finance / Bookkeeping", match: ["finance", "bookkeep", "account", "invoic", "payroll"] },
  { label: "Operations", match: ["operations", "ops", "project manager", "logistics"] },
  { label: "Administrative Assistant", match: ["assistant", "admin", "scheduling", "executive"] },
  { label: "Researcher", match: ["research", "analyst", "data"] },
];

function matchesRoleBucket(role: string | null | undefined, label: string): boolean {
  const bucket = ROLE_BUCKETS.find((b) => b.label === label);
  if (!bucket) return false;
  const value = (role ?? "").toLowerCase();
  return bucket.match.some((token) => value.includes(token));
}

function matchesIndustry(industries: string[] | null | undefined, label: string): boolean {
  // Compare across the whole array, case-insensitively — the previous version
  // only looked at industries[0], which is null on most listings.
  return (industries ?? []).some((value) => value.toLowerCase() === label.toLowerCase());
}

const PRICE_RANGES = [
  { label: "Free", min: 0, max: 0 },
  { label: "Under $100/mo", min: 1, max: 100 },
  { label: "$100–$500/mo", min: 100, max: 500 },
  { label: "$500+/mo", min: 500, max: Infinity },
  { label: "Custom Pricing", custom: true },
];

/**
 * "Recommended" ordering. Ploy Pro is one weighted factor among several, not
 * an override: the boost is worth less than a relevance tier or a report
 * match, so a Ploy Pro listing rises among comparably relevant results but
 * never jumps ahead of a listing that fits the query better.
 */
const WEIGHT = {
  /** Query term appears in the name — the strongest relevance signal we have. */
  nameHit: 4000,
  /** Query term appears in role or stated business problems. */
  contextHit: 2000,
  /** This employee was recommended by the report the visitor arrived from. */
  reportMatch: 1000,
  /**
   * Ploy Pro while browsing — no search term, so there is no relevance signal
   * for Ploy Pro to displace. It outranks rating alone, putting Ploy Pro
   * listings at the top of the default view. It stays below reportMatch: a
   * visitor arriving from their own report should still see their matches
   * first.
   */
  proBrowse: 500,
  /**
   * Ploy Pro while searching — only a tiebreak. Once someone types a query,
   * how well a listing fits it has to lead, so this can lift a listing past
   * comparable ones but never past a better match.
   */
  proSearch: 12,
  /** Rating contributes up to 25 (5 stars x 5). */
  ratingMultiplier: 5,
} as const;

function recommendedScore(
  employee: EmployeeWithCategory,
  search: string,
  matchedIds: Set<string>
): number {
  let score = 0;

  const term = search.trim().toLowerCase();
  if (term) {
    if ((employee.name ?? "").toLowerCase().includes(term)) score += WEIGHT.nameHit;
    const context = `${employee.role ?? ""} ${(employee.business_problems ?? []).join(" ")}`.toLowerCase();
    if (context.includes(term)) score += WEIGHT.contextHit;
  }

  if (matchedIds.has(employee.id)) score += WEIGHT.reportMatch;
  if (employee.is_pro_boosted) score += term ? WEIGHT.proSearch : WEIGHT.proBrowse;
  score += (employee.avg_rating ?? 0) * WEIGHT.ratingMultiplier;

  return score;
}

function mapPriceToRange(price: number | null | undefined): string | null {
  if (price === null || price === undefined) return "Custom Pricing";
  if (price === 0) return "Free";
  if (price < 100) return "Under $100/mo";
  if (price <= 500) return "$100–$500/mo";
  return "$500+/mo";
}

type FilterOption = { value: string; label: string; count: number };

/**
 * One filter section. The count next to each option comes from the catalog, so
 * a visitor can see what a choice will do before making it — the panel used to
 * offer options that matched nothing and led straight to an empty result set.
 */
function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2.5 text-sm hover:text-foreground"
          >
            <Checkbox
              checked={selected.includes(option.value)}
              onCheckedChange={() => onToggle(option.value)}
            />
            <span className="flex-1">{option.label}</span>
            <span className="font-mono text-xs text-muted-foreground">{option.count}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function MarketplaceBrowser({
  employees,
  categories,
  agencies,
  initialCategory,
  matchedIds,
}: {
  employees: EmployeeWithCategory[];
  categories: Category[];
  agencies: Agency[];
  initialCategory?: string;
  matchedIds: Set<string>;
}) {
  const [search, setSearch] = useState("");
  const [selectedProblems, setSelectedProblems] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedEmployeeTypes, setSelectedEmployeeTypes] = useState<string[]>([]);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  // Recommended is the default: it's the only ordering that weighs Ploy Pro,
  // and the previous default (Highest Rated) is an explicit sort that
  // deliberately ignores it — so the boost never applied on the page anyone
  // actually lands on.
  const [sort, setSort] = useState<SortKey>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = employees.filter((e) => {
      if (search) {
        const haystack = `${e.name} ${e.role} ${(e.business_problems ?? []).join(" ")}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }

      if (selectedProblems.length) {
        // The problem taxonomy is the categories table. The previous version
        // compared these labels against business_problems, which holds
        // free-text sentences ("I need to automate sales conversations..."),
        // so it could never match and every selection returned nothing.
        if (!e.category || !selectedProblems.includes(e.category.slug)) return false;
      }

      if (selectedEmployeeTypes.length) {
        if (!selectedEmployeeTypes.some((label) => matchesRoleBucket(e.role, label))) return false;
      }

      if (selectedBusinessTypes.length) {
        if (!selectedBusinessTypes.some((label) => matchesIndustry(e.industries, label))) return false;
      }

      if (selectedPrices.length) {
        const priceRange = mapPriceToRange(e.price_monthly);
        if (!selectedPrices.includes(priceRange ?? "")) return false;
      }

      return true;
    });

    result = [...result].sort((a, b) => {
      // Only "Recommended" weighs Ploy Pro. The explicit sorts below are the
      // visitor's stated intent, so they stay exactly what they say they are.
      switch (sort) {
        case "highest-rated":
          return (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
        case "most-popular":
          return (b.total_purchases ?? 0) - (a.total_purchases ?? 0);
        case "price-low":
          return (a.price_monthly ?? Infinity) - (b.price_monthly ?? Infinity);
        case "price-high":
          return (b.price_monthly ?? 0) - (a.price_monthly ?? 0);
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "recommended":
        default: {
          const diff = recommendedScore(b, search, matchedIds) - recommendedScore(a, search, matchedIds);
          // Stable tiebreak so equal scores don't shuffle between renders.
          return diff || a.name.localeCompare(b.name);
        }
      }
    });

    return result;
  }, [employees, search, selectedProblems, selectedEmployeeTypes, selectedBusinessTypes, selectedPrices, sort, matchedIds]);

  /**
   * Filter options are derived from the catalog rather than hardcoded, with a
   * count beside each one. Anything matching zero listings is dropped, so the
   * panel can't offer a filter that leads to an empty result set.
   */
  const options = useMemo(() => {
    const countBy = <T,>(items: T[], predicate: (e: EmployeeWithCategory, item: T) => boolean) =>
      items
        .map((item) => ({ item, count: employees.filter((e) => predicate(e, item)).length }))
        .filter((entry) => entry.count > 0);

    const problems = countBy(categories, (e, c) => e.category?.slug === c.slug).map(
      ({ item, count }) => ({ value: item.slug, label: item.name, count })
    );

    const roles = countBy(ROLE_BUCKETS, (e, b) => matchesRoleBucket(e.role, b.label)).map(
      ({ item, count }) => ({ value: item.label, label: item.label, count })
    );

    // Industries are supplier-entered free text, so collapse case variants
    // ("Agencies" / "agencies") onto the first spelling seen.
    const industryLabels = new Map<string, string>();
    for (const employee of employees) {
      for (const industry of employee.industries ?? []) {
        const key = industry.trim().toLowerCase();
        if (key && !industryLabels.has(key)) industryLabels.set(key, industry.trim());
      }
    }
    const businessTypes = countBy([...industryLabels.values()], (e, label) =>
      matchesIndustry(e.industries, label)
    )
      .sort((a, b) => b.count - a.count || a.item.localeCompare(b.item))
      .map(({ item, count }) => ({ value: item, label: item, count }));

    const prices = countBy(PRICE_RANGES, (e, r) => mapPriceToRange(e.price_monthly) === r.label).map(
      ({ item, count }) => ({ value: item.label, label: item.label, count })
    );

    return { problems, roles, businessTypes, prices };
  }, [employees, categories]);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearFilters() {
    setSearch("");
    setSelectedProblems([]);
    setSelectedEmployeeTypes([]);
    setSelectedBusinessTypes([]);
    setSelectedPrices([]);
  }

  const activeFilterCount = selectedProblems.length + selectedEmployeeTypes.length + selectedBusinessTypes.length + selectedPrices.length;

  const FiltersPanel = (
    <div className="rounded-2xl bg-black/40 p-6">
      {/* Pinned above the scroll area so it stays reachable however far down
          the visitor is when they decide to start over. */}
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
        <h3 className="text-sm font-semibold">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-ploy-gold/15 px-2 py-0.5 text-xs font-semibold text-ploy-gold">
              {activeFilterCount}
            </span>
          )}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          disabled={activeFilterCount === 0}
          className="h-auto px-2 py-1 text-xs disabled:opacity-40"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </Button>
      </div>

      <div className="flex max-h-[calc(100vh-260px)] flex-col gap-8 overflow-y-auto">
        <FilterGroup
          title="Business Problem"
          options={options.problems}
          selected={selectedProblems}
          onToggle={(value) => toggle(selectedProblems, setSelectedProblems, value)}
        />
        <FilterGroup
          title="AI Employee"
          options={options.roles}
          selected={selectedEmployeeTypes}
          onToggle={(value) => toggle(selectedEmployeeTypes, setSelectedEmployeeTypes, value)}
        />
        <FilterGroup
          title="Business Type"
          options={options.businessTypes}
          selected={selectedBusinessTypes}
          onToggle={(value) => toggle(selectedBusinessTypes, setSelectedBusinessTypes, value)}
        />
        <FilterGroup
          title="Price"
          options={options.prices}
          selected={selectedPrices}
          onToggle={(value) => toggle(selectedPrices, setSelectedPrices, value)}
        />
      </div>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24">{FiltersPanel}</div>
      </aside>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="What business problem do you need to solve?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                  {activeFilterCount > 0 && <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-ploy-gold text-xs font-medium text-black">{activeFilterCount}</span>}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                {/* FiltersPanel carries its own "Filters" header now. */}
                <div className="mt-8">{FiltersPanel}</div>
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{filtered.length} AI employees</p>

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((employee, i) => (
              <LiveEmployeeCard key={employee.id} employee={employee} index={i} isReportMatch={matchedIds.has(employee.id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
            <p className="font-medium">No AI employees match your filters</p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
