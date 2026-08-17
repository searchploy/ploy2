/**
 * Stripe Customer Management
 *
 * Handle customer creation, updates, and retrieval from Stripe.
 * Customers in Stripe represent billing entities - sync with profiles table.
 */

import { stripe } from './index'
import { createClient } from '@/lib/supabase/server'

export interface CreateCustomerParams {
  profileId: string
  email: string
  name?: string
  metadata?: Record<string, string>
}

/**
 * Create a Stripe customer and link to profile
 */
export async function createStripeCustomer({
  profileId,
  email,
  name,
  metadata,
}: CreateCustomerParams): Promise<string> {
  // Create customer in Stripe
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      profile_id: profileId,
      ...metadata,
    },
  })

  // Link to profile in database
  const supabase = await createClient()
  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', profileId)

  return customer.id
}

/**
 * Get or create Stripe customer for a profile
 */
export async function getOrCreateStripeCustomer(
  profileId: string,
  email: string,
  name?: string
): Promise<string> {
  const supabase = await createClient()

  // Check if customer already exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', profileId)
    .single()

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id
  }

  // Create new customer
  return createStripeCustomer({ profileId, email, name })
}

/**
 * Update Stripe customer metadata or details
 */
export async function updateStripeCustomer(
  customerId: string,
  updates: {
    email?: string
    name?: string
    metadata?: Record<string, string>
  }
): Promise<void> {
  await stripe.customers.update(customerId, updates)
}

/**
 * Delete Stripe customer (rarely needed - usually just stop billing)
 */
export async function deleteStripeCustomer(customerId: string): Promise<void> {
  await stripe.customers.del(customerId)
}

/**
 * Retrieve customer details from Stripe
 */
export async function getStripeCustomer(customerId: string) {
  return stripe.customers.retrieve(customerId)
}

/**
 * Set default payment method for customer
 */
export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<void> {
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })
}
