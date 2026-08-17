import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { DEMO_AGENCY_ID } from "@/lib/data/users";
import { getEmployees } from "@/lib/data/employees";

export default async function AgencyPricingPage() {
  const employees = (await getEmployees()).filter((e) => e.agency_id === DEMO_AGENCY_ID);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Pricing" description="Pricing tiers configured for each of your AI employees." />

      <div className="flex flex-col gap-6">
        {employees.map((employee) => (
          <Card key={employee.id} className="flex flex-col gap-4 p-6">
            <h2 className="font-semibold">{employee.name}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {employee.pricing.map((tier) => (
                <div key={tier.id} className="flex flex-col gap-2 rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{tier.tier_name}</p>
                    {tier.is_most_popular && <Badge variant="blue">Popular</Badge>}
                  </div>
                  <p className="text-xl font-semibold">
                    {tier.billing_period === "custom" && tier.price_cents === 0 ? "Custom" : formatCurrency(tier.price_cents)}
                  </p>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
