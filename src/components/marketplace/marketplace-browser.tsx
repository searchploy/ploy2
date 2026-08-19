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

const BUSINESS_PROBLEMS = [
  "Generate More Leads",
  "Improve Sales",
  "Improve Customer Support",
  "Automate Admin Work",
  "Create Marketing Content",
  "Improve Recruiting",
  "Manage Finance",
  "Automate Operations",
];

const AI_EMPLOYEE_TYPES = [
  "Sales Representative",
  "SDR / Lead Generation",
  "Customer Support",
  "Marketing",
  "Content Creator",
  "Recruiter",
  "Finance / Bookkeeping",
  "Operations",
  "Administrative Assistant",
  "Researcher",
];

const BUSINESS_TYPES = [
  "Small Business",
  "Startup",
  "Agency",
  "E-commerce",
  "SaaS",
  "Local Business",
  "Real Estate",
  "Enterprise",
];

const PRICE_RANGES = [
  { label: "Free", min: 0, max: 0 },
  { label: "Under $100/mo", min: 1, max: 100 },
  { label: "$100–$500/mo", min: 100, max: 500 },
  { label: "$500+/mo", min: 500, max: Infinity },
  { label: "Custom Pricing", custom: true },
];

function mapPriceToRange(price: number | null | undefined): string | null {
  if (price === null || price === undefined) return "Custom Pricing";
  if (price === 0) return "Free";
  if (price < 100) return "Under $100/mo";
  if (price <= 500) return "$100–$500/mo";
  return "$500+/mo";
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
  const [sort, setSort] = useState<SortKey>(matchedIds.size > 0 ? "recommended" : "highest-rated");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = employees.filter((e) => {
      if (search) {
        const haystack = `${e.name} ${e.role} ${(e.business_problems ?? []).join(" ")}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }

      if (selectedProblems.length) {
        const hasMatch = (e.business_problems ?? []).some((p) => selectedProblems.includes(p));
        if (!hasMatch) return false;
      }

      if (selectedEmployeeTypes.length) {
        // Map role to employee type - flexible matching
        const roleMatches = selectedEmployeeTypes.some((type) => {
          const eRole = (e.role || "").toLowerCase();
          const typeNorm = type.toLowerCase();
          return eRole.includes(typeNorm.split("/")[0].trim());
        });
        if (!roleMatches) return false;
      }

      if (selectedBusinessTypes.length) {
        const eBizType = (e.industries?.[0] || "").toLowerCase();
        const hasMatch = selectedBusinessTypes.some((type) => eBizType.includes(type.toLowerCase()));
        if (!hasMatch) return false;
      }

      if (selectedPrices.length) {
        const priceRange = mapPriceToRange(e.price_monthly);
        if (!selectedPrices.includes(priceRange ?? "")) return false;
      }

      return true;
    });

    result = [...result].sort((a, b) => {
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
          const aMatch = matchedIds.has(a.id) ? 1 : 0;
          const bMatch = matchedIds.has(b.id) ? 1 : 0;
          return bMatch - aMatch || (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
        }
      }
    });

    return result;
  }, [employees, search, selectedProblems, selectedEmployeeTypes, selectedBusinessTypes, selectedPrices, sort, matchedIds]);

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
      <div className="flex max-h-[calc(100vh-200px)] flex-col gap-8 overflow-y-auto">
        <div>
          <h3 className="mb-3 text-sm font-semibold">Business Problem</h3>
          <div className="flex flex-col gap-2.5">
            {BUSINESS_PROBLEMS.map((problem) => (
              <label key={problem} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox
                  checked={selectedProblems.includes(problem)}
                  onCheckedChange={() => toggle(selectedProblems, setSelectedProblems, problem)}
                />
                {problem}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">AI Employee</h3>
          <div className="flex flex-col gap-2.5">
            {AI_EMPLOYEE_TYPES.map((type) => (
              <label key={type} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox
                  checked={selectedEmployeeTypes.includes(type)}
                  onCheckedChange={() => toggle(selectedEmployeeTypes, setSelectedEmployeeTypes, type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Business Type</h3>
          <div className="flex flex-col gap-2.5">
            {BUSINESS_TYPES.map((type) => (
              <label key={type} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox
                  checked={selectedBusinessTypes.includes(type)}
                  onCheckedChange={() => toggle(selectedBusinessTypes, setSelectedBusinessTypes, type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Price</h3>
          <div className="flex flex-col gap-2.5">
            {PRICE_RANGES.map((range) => (
              <label key={range.label} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox
                  checked={selectedPrices.includes(range.label)}
                  onCheckedChange={() => toggle(selectedPrices, setSelectedPrices, range.label)}
                />
                {range.label}
              </label>
            ))}
          </div>
        </div>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="self-start">
            <X className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
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
                <h2 className="mb-6 text-lg font-semibold">Filters</h2>
                <div className="mt-2">{FiltersPanel}</div>
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
