import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  // Get the most recent active subscription
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const subscription = subscriptions?.[0] || null;

  return <BillingPageContent profile={profile} subscription={subscription} />;
}
