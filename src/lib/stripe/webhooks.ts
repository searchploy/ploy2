/**
 * Stripe Webhook Event Handlers
 *
 * Process Stripe webhook events and update application state.
 * Handle subscription lifecycle, payments, and invoicing events.
 */

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { syncInvoiceToDatabase } from './invoices'

/**
 * Handle subscription created event
 */
export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<void> {
  const profileId = subscription.metadata?.profile_id
  if (!profileId) return

  const supabase = await createClient()

  const item = subscription.items.data[0]
  if (!item?.price) return

  // Determine subscription type from metadata (pro or consulting)
  const subscriptionType = (subscription.metadata?.subscription_type || 'pro') as 'pro' | 'consulting'

  await supabase.from('subscriptions').insert({
    profile_id: profileId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: item.price.id,
    type: subscriptionType,
    status: subscription.status as 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid',
    current_period_start: new Date(
      ((subscription as unknown as Record<string, unknown>).current_period_start as number) * 1000
    ).toISOString(),
    current_period_end: new Date(
      ((subscription as unknown as Record<string, unknown>).current_period_end as number) * 1000
    ).toISOString(),
  })

  // Update profile: set subscription plan to pro and mark email as verified
  // (user must have verified email to complete checkout)
  await supabase
    .from('profiles')
    .update({ subscription_plan: 'pro', email_verified: true, email_verified_at: new Date().toISOString() })
    .eq('id', profileId)
}

/**
 * Handle subscription updated event
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const profileId = subscription.metadata?.profile_id
  if (!profileId) return

  const supabase = await createClient()
  const item = subscription.items.data[0]

  const updates: {
    status: string
    current_period_end: string
    cancel_at_period_end: boolean
    stripe_price_id?: string
  } = {
    status: subscription.status,
    current_period_end: new Date(
      ((subscription as unknown as Record<string, unknown>).current_period_end as number) * 1000
    ).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  }

  if (item?.price) {
    updates.stripe_price_id = item.price.id
  }

  await supabase
    .from('subscriptions')
    .update(updates)
    .eq('stripe_subscription_id', subscription.id)
}

/**
 * Handle subscription deleted/cancelled event
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const profileId = subscription.metadata?.profile_id
  if (!profileId) return

  const supabase = await createClient()

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id)

  // Reset profile to free plan
  await supabase
    .from('profiles')
    .update({ subscription_plan: 'free' })
    .eq('id', profileId)
}

/**
 * Handle invoice paid event
 */
export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string
  if (!customerId) return

  // Get profile from Stripe customer
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  // Sync invoice to database
  await syncInvoiceToDatabase(invoice, profile.id)

  // Mark invoice as paid in our database
  await supabase
    .from('stripe_invoices')
    .update({
      status: 'paid',
      paid_at: new Date(((invoice as unknown as Record<string, unknown>).paid_at as number) * 1000).toISOString(),
      amount_paid_cents: invoice.amount_paid,
    })
    .eq('stripe_invoice_id', invoice.id)
}

/**
 * Handle invoice payment failed event
 */
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  const customerId = invoice.customer as string
  if (!customerId) return

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  // Sync invoice to database
  await syncInvoiceToDatabase(invoice, profile.id)

  // Create notification for payment failure
  await supabase.from('notifications').insert({
    profile_id: profile.id,
    type: 'payment_failed',
    title: 'Payment Failed',
    body: `Payment of $${(invoice.amount_due / 100).toFixed(2)} failed. Please update your payment method.`,
    link: '/dashboard/billing',
  })
}

/**
 * Handle invoice created event
 */
export async function handleInvoiceCreated(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string
  if (!customerId) return

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  // Sync invoice to database
  await syncInvoiceToDatabase(invoice, profile.id)
}

/**
 * Handle charge succeeded event
 */
export async function handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
  const customerId = charge.customer as string
  if (!customerId) return

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  // Check if this is a report purchase
  const reportId = charge.metadata?.report_id
  if (reportId) {
    // Handle report purchase
    await supabase
      .from('report_purchases')
      .update({
        stripe_charge_id: charge.id,
        status: 'succeeded',
        paid_at: new Date(charge.created * 1000).toISOString(),
      })
      .eq('report_id', reportId)

    // Mark report as paid
    await supabase
      .from('reports')
      .update({
        is_paid: true,
        purchased_at: new Date(charge.created * 1000).toISOString(),
      })
      .eq('id', reportId)

    // Create notification
    await supabase.from('notifications').insert({
      profile_id: profile.id,
      type: 'report_purchased',
      title: 'Report Unlocked',
      body: 'Your AI report has been purchased and is now available for download.',
      link: `/dashboard/business/reports/${reportId}`,
    })
  } else {
    // Log general charge
    await supabase.from('stripe_charges').insert({
      profile_id: profile.id,
      stripe_charge_id: charge.id,
      amount_cents: charge.amount,
      currency: charge.currency,
      description: charge.description,
      receipt_email: charge.receipt_email,
      paid: true,
      metadata: charge.metadata as Record<string, string>,
    })
  }
}

/**
 * Handle charge failed event
 */
export async function handleChargeFailed(charge: Stripe.Charge): Promise<void> {
  const customerId = charge.customer as string
  if (!customerId) return

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  // Log failed charge
  await supabase.from('stripe_charges').insert({
    profile_id: profile.id,
    stripe_charge_id: charge.id,
    amount_cents: charge.amount,
    currency: charge.currency,
    description: charge.description,
    receipt_email: charge.receipt_email,
    paid: false,
    metadata: {
      failure_code: charge.failure_code || '',
      failure_message: charge.failure_message || '',
    } as Record<string, string>,
  })

  // Notify user
  await supabase.from('notifications').insert({
    profile_id: profile.id,
    type: 'charge_failed',
    title: 'Charge Failed',
    body: `A charge of $${(charge.amount / 100).toFixed(2)} failed to process.`,
    link: '/dashboard/billing',
  })
}

/**
 * Handle charge refunded event
 */
export async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  if (!charge.refunded || charge.amount_refunded === 0) return

  const supabase = await createClient()

  // Update charge record
  await supabase
    .from('stripe_charges')
    .update({
      refunded: true,
      refunded_amount_cents: charge.amount_refunded,
    })
    .eq('stripe_charge_id', charge.id)
}

/**
 * Main webhook event dispatcher
 */
export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
  try {
    switch (event.type) {
      // Subscription events
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      // Invoice events
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'invoice.created':
        await handleInvoiceCreated(event.data.object as Stripe.Invoice)
        break

      // Charge events
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge)
        break

      case 'charge.failed':
        await handleChargeFailed(event.data.object as Stripe.Charge)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`Unhandled webhook event: ${event.type}`)
    }
  } catch (error) {
    console.error(`Error handling webhook ${event.type}:`, error)
    throw error
  }
}
