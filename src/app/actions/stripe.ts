'use server'

/**
 * Stripe Server Actions
 *
 * These are called from the client to initiate Stripe operations.
 * They run on the server for security and return results to the client.
 */

import { redirect } from 'next/navigation'
import { stripe, getPriceId } from '@/lib/stripe'
import {
  getOrCreateStripeCustomer,
  setDefaultPaymentMethod,
} from '@/lib/stripe/customers'
import {
  createSubscription,
  updateSubscription,
  cancelSubscription,
  cancelSubscriptionAtPeriodEnd,
} from '@/lib/stripe/subscriptions'
import { REPORT_PRICE_CENTS } from '@/lib/stripe/report-purchases'
import { getServerUser } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

export interface CheckoutResult {
  sessionId: string
  clientSecret?: string
  error?: string
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  subscriptionType: 'business' | 'consultant' | 'agency',
  interval: 'month' | 'year'
): Promise<CheckoutResult> {
  try {
    const user = await getServerUser()
    if (!user?.email) {
      return { error: 'User not authenticated', sessionId: '' }
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email,
      user.user_metadata?.full_name
    )

    // Get the price ID for this subscription type and interval
    const priceId = getPriceId(subscriptionType, interval)
    if (!priceId) {
      return { error: 'Price not configured', sessionId: '' }
    }

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard/${subscriptionType}/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${baseUrl}/${subscriptionType === 'business' ? '' : subscriptionType}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          profile_id: user.id,
          subscription_type: subscriptionType,
        },
      },
      client_reference_id: user.id,
    })

    return {
      sessionId: session.id,
      clientSecret: session.client_secret || undefined,
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create checkout',
      sessionId: '',
    }
  }
}

/**
 * Upgrade or downgrade subscription
 */
export async function updateSubscriptionPlan(
  interval: 'month' | 'year'
): Promise<{ error?: string; success?: boolean }> {
  try {
    const user = await getServerUser()
    if (!user) {
      return { error: 'User not authenticated' }
    }

    const supabase = await createClient()

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('profile_id', user.id)
      .maybeSingle()

    if (subError || !subscription) {
      return { error: 'No active subscription found' }
    }

    // Get new price for same type, different interval
    const newPriceId = getPriceId(subscription.type, interval)
    if (!newPriceId) {
      return { error: 'Price not configured' }
    }

    // Update subscription
    await updateSubscription({
      subscriptionId: subscription.stripe_subscription_id,
      priceId: newPriceId,
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating subscription:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update subscription',
    }
  }
}

/**
 * Cancel subscription at end of billing period
 */
export async function cancelSubscriptionAction(): Promise<{
  error?: string
  success?: boolean
}> {
  try {
    const user = await getServerUser()
    if (!user) {
      return { error: 'User not authenticated' }
    }

    const supabase = await createClient()

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('profile_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (subError || !subscription) {
      return { error: 'No active subscription found' }
    }

    // Cancel at period end (allows service through current period)
    await cancelSubscriptionAtPeriodEnd(subscription.stripe_subscription_id)

    return { success: true }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to cancel subscription',
    }
  }
}

/**
 * Immediately cancel subscription
 */
export async function cancelSubscriptionImmediateAction(): Promise<{
  error?: string
  success?: boolean
}> {
  try {
    const user = await getServerUser()
    if (!user) {
      return { error: 'User not authenticated' }
    }

    const supabase = await createClient()

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('profile_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (subError || !subscription) {
      return { error: 'No active subscription found' }
    }

    // Cancel immediately
    await cancelSubscription(subscription.stripe_subscription_id)

    return { success: true }
  } catch (error) {
    console.error('Error canceling subscription immediately:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to cancel subscription',
    }
  }
}

/**
 * Add payment method to customer
 */
export async function addPaymentMethodAction(
  paymentMethodId: string,
  isDefault: boolean = false
): Promise<{ error?: string; success?: boolean }> {
  try {
    const user = await getServerUser()
    if (!user?.email) {
      return { error: 'User not authenticated' }
    }

    const supabase = await createClient()

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user.id, user.email)

    // Attach payment method
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })

    // Store in database
    await supabase.from('stripe_payment_methods').insert({
      profile_id: user.id,
      stripe_payment_method_id: paymentMethodId,
      is_default: isDefault,
      type: 'card',
    })

    // Set as default if requested
    if (isDefault) {
      await setDefaultPaymentMethod(customerId, paymentMethodId)
    }

    return { success: true }
  } catch (error) {
    console.error('Error adding payment method:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to add payment method',
    }
  }
}

/**
 * Remove payment method
 */
export async function removePaymentMethodAction(paymentMethodId: string): Promise<{
  error?: string
  success?: boolean
}> {
  try {
    const user = await getServerUser()
    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Detach from Stripe
    await stripe.paymentMethods.detach(paymentMethodId)

    // Remove from database
    const supabase = await createClient()
    await supabase
      .from('stripe_payment_methods')
      .delete()
      .eq('profile_id', user.id)
      .eq('stripe_payment_method_id', paymentMethodId)

    return { success: true }
  } catch (error) {
    console.error('Error removing payment method:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to remove payment method',
    }
  }
}

/**
 * Get checkout session details (for success page)
 */
export async function getCheckoutSession(sessionId: string): Promise<any> {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    })
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    throw error
  }
}

/**
 * Purchase a report ($39 one-time charge)
 * For Business users who want to unlock full report features
 */
export async function purchaseReportAction(reportId: string): Promise<{
  error?: string
  chargeId?: string
  success?: boolean
}> {
  try {
    const user = await getServerUser()
    if (!user?.email) {
      return { error: 'User not authenticated' }
    }

    const supabase = await createClient()

    // Get the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .eq('profile_id', user.id)
      .maybeSingle()

    if (reportError || !report) {
      return { error: 'Report not found' }
    }

    // Check if already purchased
    const { data: existing } = await supabase
      .from('report_purchases')
      .select('id')
      .eq('report_id', reportId)
      .eq('status', 'succeeded')
      .maybeSingle()

    if (existing) {
      return { error: 'Report already purchased' }
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user.id, user.email, user.user_metadata?.full_name)

    // Create charge for report
    const charge = await stripe.charges.create({
      amount: REPORT_PRICE_CENTS,
      currency: 'usd',
      customer: customerId,
      description: `AI Report - ${report.business_name || 'Report'}`,
      receipt_email: user.email,
      metadata: {
        profile_id: user.id,
        report_id: reportId,
        type: 'report_purchase',
      },
    })

    // Record purchase in database
    await supabase.from('report_purchases').insert({
      report_id: reportId,
      profile_id: user.id,
      stripe_charge_id: charge.id,
      amount_cents: REPORT_PRICE_CENTS,
      currency: 'usd',
      status: charge.paid ? 'succeeded' : 'pending',
      paid_at: charge.paid ? new Date(charge.created * 1000).toISOString() : null,
    })

    // If charge succeeded, mark report as paid
    if (charge.paid) {
      await supabase
        .from('reports')
        .update({
          is_paid: true,
          purchased_at: new Date().toISOString(),
        })
        .eq('id', reportId)

      // Create notification
      await supabase.from('notifications').insert({
        profile_id: user.id,
        type: 'report_purchased',
        title: 'Report Purchased',
        body: `Your AI report has been purchased for $39.00. Download it now!`,
        link: `/dashboard/business/reports/${reportId}`,
      })
    }

    return {
      success: charge.paid,
      chargeId: charge.id,
    }
  } catch (error) {
    console.error('Error purchasing report:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to purchase report',
    }
  }
}
