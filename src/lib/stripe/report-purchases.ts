/**
 * Report Purchase Management (Pay-Per-Report Model)
 *
 * Handles one-time $39 charges for AI reports (Business tier pricing).
 * Users generate a report for free, then pay to unlock/export it.
 */

import Stripe from 'stripe'
import { stripe } from './index'
import { createClient } from '@/lib/supabase/server'

export const REPORT_PRICE_CENTS = 3900 // $39.00

export interface CreateReportChargeParams {
  reportId: string
  profileId: string
  customerId: string
  email: string
  description?: string
}

export interface ReportPurchase {
  id: string
  report_id: string
  profile_id: string
  stripe_charge_id?: string
  stripe_payment_intent_id?: string
  amount_cents: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  paid_at?: string
  refunded_at?: string
  refund_reason?: string
  metadata?: Record<string, string>
  created_at: string
  updated_at: string
}

/**
 * Create a charge for a report ($39)
 * Returns the charge ID and status
 */
export async function createReportCharge({
  reportId,
  profileId,
  customerId,
  email,
  description = 'AI Report - Ploy',
}: CreateReportChargeParams): Promise<{ chargeId: string; status: string }> {
  // Create charge in Stripe
  const charge = await stripe.charges.create({
    amount: REPORT_PRICE_CENTS,
    currency: 'usd',
    customer: customerId,
    description,
    receipt_email: email,
    metadata: {
      profile_id: profileId,
      report_id: reportId,
      type: 'report_purchase',
    },
  })

  // Record in database
  const supabase = await createClient()
  await supabase.from('report_purchases').insert({
    report_id: reportId,
    profile_id: profileId,
    stripe_charge_id: charge.id,
    amount_cents: REPORT_PRICE_CENTS,
    currency: 'usd',
    status: charge.paid ? 'succeeded' : 'pending',
    paid_at: charge.paid ? new Date(charge.created * 1000).toISOString() : null,
  })

  return {
    chargeId: charge.id,
    status: charge.status,
  }
}

/**
 * Create a payment intent for a report (for async handling)
 * Used when charge needs additional authentication (3D Secure, etc)
 */
export async function createReportPaymentIntent({
  reportId,
  profileId,
  customerId,
  email,
}: {
  reportId: string
  profileId: string
  customerId: string
  email: string
}): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const intent = await stripe.paymentIntents.create({
    amount: REPORT_PRICE_CENTS,
    currency: 'usd',
    customer: customerId,
    receipt_email: email,
    metadata: {
      profile_id: profileId,
      report_id: reportId,
      type: 'report_purchase',
    },
    automatic_payment_methods: {
      enabled: true,
    },
  })

  // Record in database
  const supabase = await createClient()
  await supabase.from('report_purchases').insert({
    report_id: reportId,
    profile_id: profileId,
    stripe_payment_intent_id: intent.id,
    amount_cents: REPORT_PRICE_CENTS,
    currency: 'usd',
    status: 'pending',
  })

  return {
    clientSecret: intent.client_secret!,
    paymentIntentId: intent.id,
  }
}

/**
 * Check if a report has been purchased
 */
export async function isReportPurchased(reportId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('report_purchases')
    .select('id')
    .eq('report_id', reportId)
    .eq('status', 'succeeded')
    .maybeSingle()

  return !!data
}

/**
 * Get purchase details for a report
 */
export async function getReportPurchase(
  reportId: string
): Promise<ReportPurchase | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('report_purchases')
    .select('*')
    .eq('report_id', reportId)
    .maybeSingle()

  return data
}

/**
 * Get all purchases for a profile
 */
export async function getProfilePurchases(
  profileId: string
): Promise<ReportPurchase[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('report_purchases')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  return data || []
}

/**
 * Mark report as purchased and unlock it
 */
export async function unlockReportPurchase(
  reportId: string,
  chargeId: string
): Promise<void> {
  const supabase = await createClient()

  // Update purchase record
  await supabase
    .from('report_purchases')
    .update({
      stripe_charge_id: chargeId,
      status: 'succeeded',
      paid_at: new Date().toISOString(),
    })
    .eq('report_id', reportId)

  // Mark report as paid
  await supabase
    .from('reports')
    .update({
      is_paid: true,
      purchased_at: new Date().toISOString(),
    })
    .eq('id', reportId)
}

/**
 * Refund a report purchase
 */
export async function refundReportPurchase(
  reportId: string,
  reason: string = 'customer_request'
): Promise<void> {
  const supabase = await createClient()

  // Get the purchase
  const { data: purchase } = await supabase
    .from('report_purchases')
    .select('*')
    .eq('report_id', reportId)
    .eq('status', 'succeeded')
    .maybeSingle()

  if (!purchase?.stripe_charge_id) {
    throw new Error('No charge found for this report')
  }

  // Refund in Stripe
  await stripe.refunds.create({
    charge: purchase.stripe_charge_id,
    reason: reason as unknown as Stripe.RefundCreateParams['reason'],
  })

  // Update database
  await supabase
    .from('report_purchases')
    .update({
      status: 'refunded',
      refund_reason: reason,
      refunded_at: new Date().toISOString(),
    })
    .eq('report_id', reportId)

  // Mark report as unpaid
  await supabase
    .from('reports')
    .update({
      is_paid: false,
      purchased_at: null,
    })
    .eq('id', reportId)
}

/**
 * Get charge history for auditing
 */
export async function getChargeHistory(
  reportId: string
): Promise<Array<{ chargeId: string; amount: number; status: string; date: string }>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('report_purchases')
    .select('stripe_charge_id, amount_cents, status, created_at')
    .eq('report_id', reportId)
    .order('created_at', { ascending: false })

  return (
    data?.map((item) => ({
      chargeId: item.stripe_charge_id || 'pending',
      amount: item.amount_cents,
      status: item.status,
      date: item.created_at,
    })) || []
  )
}
