import { redirect } from "next/navigation";

/**
 * The public agencies directory was removed — individual agency profile
 * pages at /agencies/[slug] still work (linked from employee listings),
 * this just retires the top-level browsable index.
 */
export default function AgenciesPage() {
  redirect("/marketplace");
}
