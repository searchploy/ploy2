import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmployeeCard } from "@/components/marketplace/employee-card";
import { DEMO_BUSINESS_USER_ID } from "@/lib/data/users";
import { getFavoritesForUser } from "@/lib/data/favorites";
import { getEmployees } from "@/lib/data/employees";

export default async function SavedEmployeesPage() {
  const [favorites, employees] = await Promise.all([
    getFavoritesForUser(DEMO_BUSINESS_USER_ID),
    getEmployees(),
  ]);
  const saved = employees
    .filter((e) => favorites.some((f) => f.employee_id === e.id))
    .map((e) => ({
      ...e,
      agency: { name: "Agency", slug: "agency", is_verified: false },
      categories: [],
    }));

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Saved" description="AI employees you've bookmarked for later." />
      {saved.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((e, i) => (
            <EmployeeCard key={e.id} employee={e} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">You haven&apos;t saved any AI employees yet.</p>
      )}
    </div>
  );
}
