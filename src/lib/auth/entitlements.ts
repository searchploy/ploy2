import { createClient, getServerUser } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import type { SubscriptionType } from "@/lib/types/database";

export type Entitlements = {
  /** Products the user actively owns. A user may own both. */
  owned: SubscriptionType[];
  pro: boolean;
  consulting: boolean;
  isAdmin: boolean;
};

const NONE: Entitlements = { owned: [], pro: false, consulting: false, isAdmin: false };

/**
 * What the current user is actually entitled to, derived from the
 * subscriptions table — one row per purchased product.
 *
 * profiles.subscription_type deliberately isn't used here: it holds a single
 * value, so owning both products would silently revoke access to whichever
 * was bought first.
 */
export async function getEntitlements(): Promise<Entitlements> {
  if (await isAdminUser()) {
    return { owned: ["pro", "consulting"], pro: true, consulting: true, isAdmin: true };
  }

  const user = await getServerUser();
  if (!user) return NONE;

  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("type")
    .eq("profile_id", user.id)
    .eq("status", "active")
    .eq("plan", "pro");

  const owned = [...new Set((data ?? []).map((row) => row.type))] as SubscriptionType[];

  return {
    owned,
    pro: owned.includes("pro"),
    consulting: owned.includes("consulting"),
    isAdmin: false,
  };
}
