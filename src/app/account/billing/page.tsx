import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPrice, getStripe } from "@/lib/stripe/server";
import { BillingPageContent } from "./billing-content";

export const metadata = {
  title: "Billing & Subscription",
  description: "Manage your billing and subscription",
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get all active subscriptions
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Fetch prices for each subscription type
  const proPrice = await getPrice("pro");
  const consultingPrice = await getPrice("consulting");

  const prices: Record<string, { amount: number }> = {
    pro: proPrice || { amount: 29.99 },
    consulting: consultingPrice || { amount: 29.99 },
  };

  // Fetch real-time cancel_at_period_end status from Stripe for each subscription
  let enrichedSubscriptions = subscriptions || [];
  try {
    const stripe = getStripe();
    enrichedSubscriptions = await Promise.all(
      enrichedSubscriptions.map(async (sub) => {
        if (sub.stripe_subscription_id) {
          const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
          return {
            ...sub,
            cancel_at_period_end: stripeSub.cancel_at_period_end,
          };
        }
        return sub;
      })
    );
  } catch (error) {
    console.error("Failed to fetch subscription status from Stripe:", error);
  }

  return <BillingPageContent profile={profile} subscriptions={enrichedSubscriptions} prices={prices} />;
}
