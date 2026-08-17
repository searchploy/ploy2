import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { LiveEmployeeCard } from "@/components/marketplace/live-employee-card";
import { Button } from "@/components/ui/button";
import { getLiveFeaturedEmployees } from "@/lib/data/live-marketplace";

export async function MarketplacePreview() {
  const employees = await getLiveFeaturedEmployees(4);

  return (
    <section className="py-24">
      <div className="container flex flex-col gap-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <SectionHeading
            align="left"
            eyebrow="Marketplace"
            title="Hire AI employees, not software"
            description="Every listing is an AI employee built to solve a specific business problem, by a vetted agency."
            className="sm:items-start sm:text-left"
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/marketplace">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {employees.map((employee, i) => (
            <LiveEmployeeCard key={employee.id} employee={employee} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
