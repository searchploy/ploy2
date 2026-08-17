/**
 * Stripe Subscription Management
 *
 * Handle subscription creation, updates, cancellations, and lifecycle.
 * Subscriptions represent recurring billing relationships.
 */

import { stripe, getPriceId } from './index'
import { createClient } from '@/lib/supabase/server'

export interface CreateSubscriptionParams {
  customerId: string
  priceId: string
  profileId: string
  subscriptionType: 'business' | 'consultant' | 'agency'
  metadata?: Record<string, string>
}

export interface UpdateSubscriptionParams {
  subscriptionId: string
  priceId: string
  prorationBehavior?: 'create_prorations' | 'none'
}

/**
 * Create a new subscription for a customer
 */
export async function createSubscription({
  customerId,
  priceId,
  profileId,
  subscriptionType,
  metadata,
}: CreateSubscriptionParams): Promise<string> {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    metadata: {
      profile_id: profileId,
      subscription_type: subscriptionType,
      ...metadata,
    },
  })

  // Sync to database
  const supabase = await createClient()
  await supabase.from('subscriptions').insert({
    profile_id: profileId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    type: subscriptionType,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  })

  return subscription.id
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  })
}

/**
 * Update subscription (e.g., upgrade/downgrade pricing)
 */
export async function updateSubscription({
  subscriptionId,
  priceId,
  prorationBehavior = 'create_prorations',
}: UpdateSubscriptionParams): Promise<void> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Get the item to update
  const item = subscription.items.data[0]
  if (!item) {
    throw new Error('Subscription has no items')
  }

  // Update the price
  await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: item.id,
        price: priceId,
      },
    ],
    proration_behavior: prorationBehavior,
  })

  // Sync to database
  const supabase = await createClient()
  await supabase
    .from('subscriptions')
    .update({ stripe_price_id: priceId })
    .eq('stripe_subscription_id', subscriptionId)
}

/**
 * Cancel subscription immediately
 */
export async function cancelSubscription(
  subscriptionId: string,
  reason?: string
): Promise<void> {
  await stripe.subscriptions.del(subscriptionId)

  // Sync to database
  const supabase = await createClient()
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: false,
    })
    .eq('stripe_subscription_id', subscriptionId)
}

/**
 * Cancel subscription at period end (allows service through current period)
 */
export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string
): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })

  // Sync to database
  const supabase = await createClient()
  await supabase
    .from('subscriptions')
    .update({ cancel_at_period_end: true })
    .eq('stripe_subscription_id', subscriptionId)
}

/**
 * Resume cancelled subscription
 */
export async function resumeSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })

  // Sync to database
  const supabase = await createClient()
  await supabase
    .from('subscriptions')
    .update({ cancel_at_period_end: false })
    .eq('stripe_subscription_id', subscriptionId)
}

/**
 * Get all subscriptions for a customer
 */
export async function getCustomerSubscriptions(customerId: string) {
  return stripe.subscriptions.list({
    customer: customerId,
    expand: ['data.default_payment_method'],
  })
}

/**
 * Get subscription by price ID (for upgrade/downgrade)
 */
export async function getPriceDetails(priceId: string) {
  return stripe.prices.retrieve(priceId, {
    expand: ['product'],
  })
}

/**
 * List all prices for a product
 */
export async function getProductPrices(productId: string) {
  return stripe.prices.list({
    product: productId,
    active: true,
  })
}
