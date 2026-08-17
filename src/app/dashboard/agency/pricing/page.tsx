import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DEMO_AGENCY_ID } from "@/lib/data/users";
import { getEmployees } from "@/lib/data/employees";

export default async function AgencyPricingPage() {
  const employees = (await getEmployees()).filter((e) => e.agency_id === DEMO_AGENCY_ID);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Pricing" description="Pricing tiers configured for each of your AI employees." />

      <div className="flex flex-col gap-6">
        {employees.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No AI employees configured yet. Create your first employee to set up pricing.</p>
          </Card>
        ) : (
          employees.map((employee) => (
            <Card key={employee.id} className="flex flex-col gap-4 p-6">
              <h2 className="font-semibold">{employee.name}</h2>
              <div className="text-sm text-muted-foreground">
                <p>Starting price: {formatCurrency(employee.starting_price_cents)}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
