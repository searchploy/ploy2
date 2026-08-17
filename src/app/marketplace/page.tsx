import type { Metadata } from "next";
import { EmployeeGrid } from "@/components/marketplace/employee-grid";
import { employees } from "@/lib/data/employees";

export const metadata: Metadata = {
  title: "AI Employee Marketplace",
  description: "Find AI employees for your business by department and industry. Simple, business-focused hiring.",
};

export default async function MarketplacePage() {
  return (
    <div className="container py-12">
      <div className="mb-10 flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">AI Employee Marketplace</h1>
        <p className="max-w-2xl text-muted-foreground">
          Find the right AI employee for your business. Filter by department and industry to narrow down your options.
        </p>
      </div>

      <EmployeeGrid employees={employees} />
    </div>
  );
}
