import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { SubscriptionType } from "@/lib/types/database";

/**
 * Handles Stripe subscription lifecycle events for all three products
 * (Business Pro, Consultant Pro, Agency Partner Pro). Which product a
 * session/subscription belongs to travels in `metadata.subscription_type`,
 * set when the Checkout session was created (see `pricing/actions.ts`).
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const profileId = session.metadata?.profile_id;
      const subscriptionType = session.metadata?.subscription_type as SubscriptionType | undefined;
      if (!profileId || !subscriptionType || !session.subscription) break;

      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : session.subscription.id;
      const stripeSub = await getStripe().subscriptions.retrieve(subscriptionId);
      const item = stripeSub.items.data[0];
      const priceId = item?.price.id ?? null;

      await supabase
        .from("profiles")
        .update({ subscription_type: subscriptionType, subscription_plan: "pro" })
        .eq("id", profileId);

      await supabase.from("subscriptions").upsert(
        {
          profile_id: profileId,
          type: subscriptionType,
          plan: "pro",
          status: "active",
          stripe_subscription_id: stripeSub.id,
          stripe_price_id: priceId,
          current_period_start: item ? new Date(item.current_period_start * 1000).toISOString() : null,
          current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
          cancel_at_period_end: stripeSub.cancel_at_period_end,
        },
        { onConflict: "stripe_subscription_id" }
      );
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const profileId = sub.metadata?.profile_id;
      const subscriptionType = sub.metadata?.subscription_type as SubscriptionType | undefined;
      const status = sub.status === "active" || sub.status === "trialing" ? "active" : sub.status === "past_due" ? "past_due" : "cancelled";
      const subItem = sub.items.data[0];

      await supabase
        .from("subscriptions")
        .update({
          status,
          current_period_start: subItem ? new Date(subItem.current_period_start * 1000).toISOString() : null,
          current_period_end: subItem ? new Date(subItem.current_period_end * 1000).toISOString() : null,
          cancel_at_period_end: sub.cancel_at_period_end,
        })
        .eq("stripe_subscription_id", sub.id);

      if (profileId && status !== "active") {
        await supabase.from("profiles").update({ subscription_plan: "free" }).eq("id", profileId);
      } else if (profileId && subscriptionType) {
        await supabase
          .from("profiles")
          .update({ subscription_plan: "pro", subscription_type: subscriptionType })
          .eq("id", profileId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const profileId = sub.metadata?.profile_id;

      await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("stripe_subscription_id", sub.id);

      if (profileId) {
        await supabase.from("profiles").update({ subscription_plan: "free" }).eq("id", profileId);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
