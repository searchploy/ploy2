import { redirect } from "next/navigation";

/**
 * In production this layout calls `getServerUser()`, verifies
 * `role === "business"` or is admin, and redirects unauthenticated visitors to
 * /sign-in. Admin users can bypass subscription requirements.
 */

export default async function BusinessDashboardLayout() {
  // Redirect to unified /dashboard/pro
  redirect("/dashboard/pro");
}
