"use client";

import { useMemo, useState } from "react";
import { Search, Check, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterSidebar } from "./filter-sidebar";
import type { Employee } from "@/lib/types/mock";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

interface EmployeeGridProps {
  employees: Employee[];
}

export function EmployeeGrid({ employees }: EmployeeGridProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ departments: [] as string[], industries: [] as string[] });

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      // Search filter
      if (search) {
        const haystack = `${emp.name} ${emp.tagline} ${emp.description}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }

      // Department filter
      if (filters.departments.length > 0 && !filters.departments.includes(emp.department)) {
        return false;
      }

      // Industry filter
      if (
        filters.industries.length > 0 &&
        !filters.industries.some((ind) => emp.industries.includes(ind))
      ) {
        return false;
      }

      return true;
    });
  }, [employees, search, filters]);

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Sidebar Filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <FilterSidebar onFilterChange={setFilters} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search AI employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "employee" : "employees"} found
          </p>
        </div>

        {/* Employee Cards - One per row */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((emp, index) => (
              <Card key={emp.id} className="overflow-hidden transition-all hover:shadow-lg hover:shadow-ploy-blue/10 hover-glow-border">
                <div className="flex flex-col gap-3 p-4">
                  {/* Title and Agency */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/marketplace/${emp.slug}`}>
                          <h3 className="text-base font-semibold transition-colors hover:text-ploy-blue">
                            {emp.name}
                          </h3>
                        </Link>
                        {emp.is_featured && (
                          <Badge className="bg-foreground/90 text-background text-xs">Featured</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Built by {emp.agency_id}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.round(emp.avg_rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium">({emp.avg_rating.toFixed(1)})</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border/50" />

                  {/* Best For, Price, Setup - single row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">📈</span>
                      <div>
                        <p className="text-xs text-muted-foreground">Best For</p>
                        <p className="text-xs font-medium">{emp.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">💰</span>
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-xs font-medium">${(emp.starting_price_cents / 100).toFixed(0)}/{emp.pricing_model === "monthly" ? "mo" : "yr"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">⏱</span>
                      <div>
                        <p className="text-xs text-muted-foreground">Setup</p>
                        <p className="text-xs font-medium">{emp.setup_days || 2} days</p>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border/50" />

                  {/* Key Features and Button - inline */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 flex-1">
                      {(emp.key_features || []).slice(0, 2).map((feature) => (
                        <div key={feature} className="flex items-center gap-1 text-xs">
                          <Check className="h-3 w-3 text-ploy-blue flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {emp.website_url && (
                        <Button asChild size="sm" variant="outline">
                          <a href={emp.website_url} target="_blank" rel="noopener noreferrer">
                            Website
                          </a>
                        </Button>
                      )}
                      <Button asChild size="sm">
                        <Link href={`/marketplace/${emp.slug}`}>View →</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
            <p className="font-medium">No AI employees match your filters</p>
            <button
              onClick={() => {
                setSearch("");
                setFilters({ departments: [], industries: [] });
              }}
              className="text-sm text-ploy-blue hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
