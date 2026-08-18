import Link from "next/link";
import { Heart } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient, getServerUser } from "@/lib/supabase/server";

interface SavedRow {
  id: string;
  employee: {
    name: string;
    slug: string;
    role: string;
    tagline: string | null;
    agency_name: string | null;
  } | null;
}

export default async function ProSavedPage() {
  const user = await getServerUser();
  const supabase = await createClient();

  const { data } = user
    ? await supabase
        .from("favorites")
        .select("id, employee:employees(name, slug, role, tagline, agency_name)")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const saved = ((data ?? []) as unknown as SavedRow[]).filter((row) => row.employee);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Saved AI Employees"
        description="AI employees you're researching. Visit a listing to reach the agency's own website."
      />

      {saved.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((row) => (
            <Card key={row.id} className="hover-glow-border flex flex-col gap-3 p-5">
              <div className="min-w-0">
                <p className="truncate font-medium">{row.employee!.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.employee!.agency_name ?? row.employee!.role}
                </p>
              </div>
              {row.employee!.tagline && (
                <p className="line-clamp-2 text-sm text-muted-foreground">{row.employee!.tagline}</p>
              )}
              <Button asChild variant="outline" size="sm" className="mt-auto">
                <Link href={`/marketplace/${row.employee!.slug}`}>View</Link>
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="You haven't saved any AI employees yet"
          description="Browse the marketplace and save the AI employees you want to research."
          actionLabel="Browse Marketplace"
          actionHref="/marketplace"
        />
      )}
    </div>
  );
}
