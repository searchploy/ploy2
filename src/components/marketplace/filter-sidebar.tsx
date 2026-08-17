"use client";

import { useState, useCallback } from "react";
import { departments, industries } from "@/lib/data/employees";

interface FilterSidebarProps {
  onFilterChange: (filters: { departments: string[]; industries: string[] }) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const handleDepartmentToggle = useCallback(
    (dept: string) => {
      const updated = selectedDepartments.includes(dept)
        ? selectedDepartments.filter((d) => d !== dept)
        : [...selectedDepartments, dept];
      setSelectedDepartments(updated);
      onFilterChange({
        departments: updated,
        industries: selectedIndustries,
      });
    },
    [selectedDepartments, selectedIndustries, onFilterChange]
  );

  const handleIndustryToggle = useCallback(
    (ind: string) => {
      const updated = selectedIndustries.includes(ind)
        ? selectedIndustries.filter((i) => i !== ind)
        : [...selectedIndustries, ind];
      setSelectedIndustries(updated);
      onFilterChange({
        departments: selectedDepartments,
        industries: updated,
      });
    },
    [selectedDepartments, selectedIndustries, onFilterChange]
  );

  const hasActiveFilters = selectedDepartments.length > 0 || selectedIndustries.length > 0;

  return (
    <aside className="flex flex-col gap-8">
      {/* Department Filter */}
      <div className="rounded-lg border border-border bg-secondary/20 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Department</h3>
          {selectedDepartments.length > 0 && (
            <button
              onClick={() => {
                setSelectedDepartments([]);
                onFilterChange({
                  departments: [],
                  industries: selectedIndustries,
                });
              }}
              className="text-xs text-ploy-blue hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {departments.map((dept) => (
            <label
              key={dept}
              className="flex cursor-pointer items-center gap-3 transition-colors hover:text-foreground"
            >
              <input
                type="checkbox"
                checked={selectedDepartments.includes(dept)}
                onChange={() => handleDepartmentToggle(dept)}
                className="h-4 w-4 cursor-pointer rounded border-border accent-ploy-blue"
              />
              <span className="text-sm text-muted-foreground">{dept}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Industry Filter */}
      <div className="rounded-lg border border-border bg-secondary/20 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Industry</h3>
          {selectedIndustries.length > 0 && (
            <button
              onClick={() => {
                setSelectedIndustries([]);
                onFilterChange({
                  departments: selectedDepartments,
                  industries: [],
                });
              }}
              className="text-xs text-ploy-blue hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {industries.map((ind) => (
            <label
              key={ind}
              className="flex cursor-pointer items-center gap-3 transition-colors hover:text-foreground"
            >
              <input
                type="checkbox"
                checked={selectedIndustries.includes(ind)}
                onChange={() => handleIndustryToggle(ind)}
                className="h-4 w-4 cursor-pointer rounded border-border accent-ploy-blue"
              />
              <span className="text-sm text-muted-foreground">{ind}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset All Filters */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            setSelectedDepartments([]);
            setSelectedIndustries([]);
            onFilterChange({
              departments: [],
              industries: [],
            });
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ploy-blue transition-colors hover:bg-secondary/50"
        >
          Reset All Filters
        </button>
      )}
    </aside>
  );
}
