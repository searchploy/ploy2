"use server";

import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export async function manageBillingAction(stripeSubscriptionId: string) {
  const stripe = getStripe();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get the subscription to find the customer ID
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .eq("profile_id", user.id)
    .single();

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  // Get the Stripe subscription to find the customer
  const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const customerId = stripeSub.customer as string;

  // Create a billing portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/account/billing`,
  });

  redirect(session.url);
}
