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

type SortKey = "relevant" | "rating" | "roi" | "price-asc";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "relevant", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "roi", label: "Highest ROI" },
  { value: "price-asc", label: "Lowest Price" },
];

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [setupTime, setSetupTime] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortKey>(matchedIds.size > 0 ? "relevant" : "rating");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const integrations = useMemo(
    () => Array.from(new Set(employees.flatMap((e) => e.integrations ?? []))).sort(),
    [employees]
  );

  const filtered = useMemo(() => {
    let result = employees.filter((e) => {
      if (search) {
        const haystack = `${e.name} ${e.role} ${(e.business_problems ?? []).join(" ")}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      if (selectedCategories.length && !(e.category && selectedCategories.includes(e.category.slug))) return false;
      if (selectedAgencies.length && !(e.agency_id && selectedAgencies.includes(e.agency_id))) return false;
      if (selectedIntegrations.length && !selectedIntegrations.some((i) => (e.integrations ?? []).includes(i))) return false;
      if (setupTime && e.setup_time !== setupTime) return false;
      if (minRating > 0 && (e.avg_rating ?? 0) < minRating) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "rating":
          return (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
        case "roi":
          return (b.avg_roi_percent ?? 0) - (a.avg_roi_percent ?? 0);
        case "price-asc":
          return (a.price_monthly ?? 0) - (b.price_monthly ?? 0);
        case "relevant":
        default: {
          const aMatch = matchedIds.has(a.id) ? 1 : 0;
          const bMatch = matchedIds.has(b.id) ? 1 : 0;
          return bMatch - aMatch || (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
        }
      }
    });

    return result;
  }, [employees, search, selectedCategories, selectedAgencies, selectedIntegrations, setupTime, minRating, sort, matchedIds]);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearFilters() {
    setSearch("");
    setSelectedCategories([]);
    setSelectedAgencies([]);
    setSelectedIntegrations([]);
    setSetupTime(null);
    setMinRating(0);
  }

  const activeFilterCount =
    selectedCategories.length + selectedAgencies.length + selectedIntegrations.length + (setupTime ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const FiltersPanel = (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Business problem</h3>
        <div className="flex flex-col gap-2.5">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center justify-between gap-2.5 text-sm">
              <span className="flex items-center gap-2.5">
                <Checkbox
                  checked={selectedCategories.includes(c.slug)}
                  onCheckedChange={() => toggle(selectedCategories, setSelectedCategories, c.slug)}
                />
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Setup time</h3>
        <div className="flex flex-col gap-2.5">
          {["Same day", "Under 1 week", "Under 1 month"].map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox checked={setupTime === t} onCheckedChange={() => setSetupTime(setupTime === t ? null : t)} />
              {t}
            </label>
          ))}
        </div>
      </div>

      {integrations.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">Integrations</h3>
          <div className="flex flex-col gap-2.5">
            {integrations.map((i) => (
              <label key={i} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox
                  checked={selectedIntegrations.includes(i)}
                  onCheckedChange={() => toggle(selectedIntegrations, setSelectedIntegrations, i)}
                />
                {i}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold">Agency</h3>
        <div className="flex flex-col gap-2.5">
          {agencies.map((agency) => (
            <label key={agency.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={selectedAgencies.includes(agency.id)}
                onCheckedChange={() => toggle(selectedAgencies, setSelectedAgencies, agency.id)}
              />
              {agency.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Minimum rating</h3>
        <div className="flex gap-2">
          {[0, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                minRating === r ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
              }`}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="self-start">
          <X className="h-3.5 w-3.5" />
          Clear all filters
        </Button>
      )}
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
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-8">{FiltersPanel}</div>
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-[170px]">
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
