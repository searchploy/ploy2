import { getServerUser } from "@/lib/supabase/server";

export const ADMIN_EMAIL = "admin@searchploy.com";

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
 * Check if user has access to a specific dashboard
 * Enforces: email verification + active subscription + correct type
 */
export async function hasPaywallAccess(requiredType: "pro" | "consulting"): Promise<boolean> {
  // Admins bypass all paywalls and don't need email verification
  if (await isAdminUser()) {
    return true;
  }

  const user = await getServerUser();
  if (!user) return false;

  // Must have verified email to access any dashboard
  if (!user.email_verified) return false;

  // Must have matching subscription type
  if (user.subscription_type !== requiredType) return false;

  // Must have active subscription (not free/canceled)
  if (user.subscription_plan !== "pro") return false;

  return true;
}
