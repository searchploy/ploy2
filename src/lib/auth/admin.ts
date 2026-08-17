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
 * Check if user has access (either admin or has paid subscription)
 */
export async function hasPaywallAccess(requiredTier: "business" | "consultant" | "agency"): Promise<boolean> {
  // Admins bypass all paywalls
  if (await isAdminUser()) {
    return true;
  }

  const user = await getServerUser();
  if (!user) return false;

  // Check subscription tier
  if (user.subscription_tier === "premium" || user.subscription_tier === requiredTier) {
    return true;
  }

  // Free users have limited access to business tier
  if (requiredTier === "business" && user.subscription_tier === "free") {
    return true;
  }

  return false;
}
