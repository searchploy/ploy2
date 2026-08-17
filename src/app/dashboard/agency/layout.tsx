import { redirect } from "next/navigation";

/**
 * In production this layout calls `getServerUser()` from
 * `src/lib/supabase/server.ts`, verifies `role === "agency"` or is admin, and redirects
 * unauthenticated/unauthorized visitors to /sign-in. Admin users can bypass subscription
 * requirements.
 */

export default async function AgencyDashboardLayout() {
  // Redirect to unified /dashboard/pro
  redirect("/dashboard/pro");
}
