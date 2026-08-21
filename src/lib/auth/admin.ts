import { getServerUser } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/constants";

export { ADMIN_EMAIL };

/**
 * Whether the current user is an admin. Admins bypass all paywalls.
 *
 * The app used to check email while the database checked profiles.role, so
 * two different definitions of "admin" had to be kept in sync by hand. They
 * are now the same test — profiles.role, matching is_admin() in the database —
 * with the email kept as a secondary condition so the existing admin account
 * cannot be locked out if its role is ever cleared.
 *
 * profiles.role is only trustworthy because migration 0021 stopped signup
 * accepting a client-supplied 'admin' role; before that this had to be email.
 */
export async function isAdminUser(): Promise<boolean> {
  const user = await getServerUser();
  if (!user) return false;
  return user.role === "admin" || user.email === ADMIN_EMAIL;
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
