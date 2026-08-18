import { getServerUser } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/constants";

export { ADMIN_EMAIL };

/**
 * Check if the current user is an admin
 * Admins can bypass all paywalls
 */
export async function isAdminUser(): Promise<boolean> {
  const user = await getServerUser();
  // Admin is identified by email address
  return user?.email === ADMIN_EMAIL;
}

/**
 * Whether the user may access a given product's dashboard.
 * Enforces: email verification + an active subscription for that product.
 *
 * Entitlements come from getEntitlements() (the subscriptions table) rather
 * than profiles.subscription_type — that column holds a single value, so a
 * user who owns both products would be locked out of one of them.
 */
export async function hasPaywallAccess(requiredType: "pro" | "consulting"): Promise<boolean> {
  const { getEntitlements } = await import("@/lib/auth/entitlements");
  const entitlements = await getEntitlements();

  // Admins bypass all paywalls and don't need email verification
  if (entitlements.isAdmin) return true;

  const user = await getServerUser();
  if (!user) return false;

  // Must have verified email to access any dashboard
  if (!user.email_verified) return false;

  return entitlements.owned.includes(requiredType);
}
