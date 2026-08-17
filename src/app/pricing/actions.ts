"use server";

import { redirect } from "next/navigation";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured, getPriceId } from "@/lib/stripe/server";
import type { SubscriptionType } from "@/lib/types/database";

const DASHBOARD_BY_TYPE: Record<SubscriptionType, string> = {
  business: "/dashboard/business",
  consultant: "/dashboard/consultant",
  agency: "/dashboard/agency",
};

/**
 * Starts a Stripe Checkout session for the given product (Business Pro,
 * Consultant Pro, or Agency Partner Pro) and redirects to it. Each product
 * is its own Checkout session/price — there's no shared "Pro" SKU — because
 * the three plans have entirely different pricing and feature sets.
 *
 * Requires STRIPE_SECRET_KEY and the matching STRIPE_PRICE_* env var to be
 * set; without them this redirects back with `?checkout=unavailable` rather
 * than throwing, since billing isn't wired up in every environment yet.
 */
export async function createCheckoutAction(subscriptionType: SubscriptionType, returnTo: string) {
  const user = await getServerUser();
  if (!user) {
    redirect(`/sign-up?role=${subscriptionType}&redirect=${encodeURIComponent(returnTo)}`);
  }

  const priceId = getPriceId(subscriptionType);
  if (!isStripeConfigured() || !priceId) {
    redirect(`${returnTo}?checkout=unavailable`);
  }

  const supabase = await createClient();
  const stripe = getStripe();

  let customerId = user.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: user.full_name ?? undefined,
      metadata: { profile_id: user.id },
    });
    customerId = customer.id;
    await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}${DASHBOARD_BY_TYPE[subscriptionType]}?checkout=success`,
    cancel_url: `${siteUrl}${returnTo}?checkout=cancelled`,
    metadata: { profile_id: user.id, subscription_type: subscriptionType },
    subscription_data: {
      metadata: { profile_id: user.id, subscription_type: subscriptionType },
    },
  });

  if (!session.url) {
    redirect(`${returnTo}?checkout=error`);
  }

  redirect(session.url);
}
