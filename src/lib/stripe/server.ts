import Stripe from "stripe";
import type { SubscriptionType } from "@/lib/types/database";

/**
 * Lazily-constructed Stripe client. Throws only when actually called without
 * a configured secret key — importing this module is always safe, so pages
 * can render normally and only the checkout action needs to handle the
 * "not configured yet" case.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key);
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Env var name per subscription product — set these once real Stripe Price IDs exist. */
const PRICE_ENV_VAR: Record<SubscriptionType, string> = {
  business: "STRIPE_PRICE_ID_BUSINESS_MONTHLY",
  consultant: "STRIPE_PRICE_ID_CONSULTANT_MONTHLY",
  agency: "STRIPE_PRICE_ID_AGENCY_MONTHLY",
};

export function getPriceId(type: SubscriptionType): string | null {
  return process.env[PRICE_ENV_VAR[type]] || null;
}

/**
 * Fetch price details from Stripe (amount, currency, billing period).
 * Returns null if price ID not found or Stripe not configured.
 */
export async function getPrice(type: SubscriptionType): Promise<{
  amount: number;
  currency: string;
  interval: string;
} | null> {
  const priceId = getPriceId(type);
  if (!priceId || !isStripeConfigured()) {
    return null;
  }

  try {
    const stripe = getStripe();
    const price = await stripe.prices.retrieve(priceId);

    if (price.unit_amount === null) return null;

    return {
      amount: price.unit_amount / 100, // Convert cents to dollars
      currency: price.currency.toUpperCase(),
      interval: price.recurring?.interval || "month",
    };
  } catch (error) {
    console.error(`Failed to fetch price ${priceId}:`, error);
    return null;
  }
}
