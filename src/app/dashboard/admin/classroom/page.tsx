import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import { deleteModuleAction } from "./actions";

export default async function AdminClassroomPage() {
  const supabase = await createClient();

  const { data: modules, error } = await supabase
    .from("classroom_modules")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching modules:", error);
    // If table doesn't exist, show setup message
    if (error.message?.includes("classroom_modules") || error.message?.includes("relation") || error.code === "PGRST116") {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Classroom Management</h1>
              <p className="text-muted-foreground mt-2">Create and edit learning modules for consultants</p>
            </div>
            <Button asChild variant="gradient" disabled>
              <span>New Module</span>
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-yellow-500/30 bg-yellow-500/5 py-12 text-center px-6">
            <div className="text-4xl">⚙️</div>
            <div>
              <p className="font-medium text-lg">Database Setup Required</p>
              <p className="text-muted-foreground mt-2 max-w-md">
                The classroom_modules table hasn&apos;t been created yet. Please apply the migration <code className="bg-secondary px-2 py-1 rounded text-xs">0007_classroom_modules.sql</code> to your Supabase database to enable this feature.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return <div className="text-red-500">Error loading classroom modules: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classroom Management</h1>
          <p className="text-muted-foreground mt-2">Create and edit learning modules for consultants</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/dashboard/admin/classroom/new">New Module</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {modules && modules.length > 0 ? (
          modules.map((module) => (
            <Card key={module.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{module.title}</h2>
                  {module.description && (
                    <p className="text-muted-foreground text-sm mt-1">{module.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Sort order: <span className="font-medium">{module.sort_order ?? 0}</span>
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/admin/classroom/${module.id}/edit`}>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={deleteModuleAction}>
                    <input type="hidden" name="id" value={module.id} />
                    <Button type="submit" size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
            <p className="font-medium">No classroom modules yet</p>
            <Button asChild>
              <Link href="/dashboard/admin/classroom/new">Create first module</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
