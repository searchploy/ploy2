/**
 * Stripe Client Initialization
 *
 * Initialize Stripe server and client instances with proper error handling.
 * This is the entry point for all Stripe operations.
 *
 * Usage:
 *   import { stripe } from '@/lib/stripe'
 *   const customer = await stripe.customers.retrieve(customerId)
 */

import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
    stripeInstance = new Stripe(key, { typescript: true })
  }
  return stripeInstance
}

/**
 * Stripe server instance - initialized with secret key
 * Use for all server-side operations (payments, subscriptions, etc)
 */
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    return getStripeInstance()[prop as keyof Stripe]
  },
})

/**
 * Constants for product and price IDs
 *
 * Consolidated to 2 products:
 * - PRO: Ploy Pro ($29.99/month) - for businesses and agencies
 * - CONSULTING: Consulting Pro ($X/month) - for consultants
 */
export const STRIPE_PRODUCTS = {
  PRO: process.env.STRIPE_PRODUCT_ID_BUSINESS_PRO || '',
  CONSULTING: process.env.STRIPE_PRODUCT_ID_CONSULTANT_PRO || '',
} as const

export const STRIPE_PRICES = {
  PRO: {
    MONTHLY: process.env.STRIPE_PRICE_ID_BUSINESS_MONTHLY || '',
  },
  CONSULTING: {
    MONTHLY: process.env.STRIPE_PRICE_ID_CONSULTANT_MONTHLY || '',
  },
  // One-time charges
  AI_REPORT: process.env.STRIPE_PRICE_ID_AI_REPORT || '', // $39.00
} as const

/**
 * Get the correct price ID based on subscription type
 * Maps the consolidated subscription types to Stripe prices
 */
export function getPriceId(type: 'pro' | 'consulting'): string {
  const typeKey = type.toUpperCase() as 'PRO' | 'CONSULTING'
  const price = STRIPE_PRICES[typeKey]
  if (typeof price === 'string') return price
  return price.MONTHLY
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string | string[] | undefined
): boolean {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return false
  }

  if (!signature) {
    return false
  }

  try {
    stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
    return true
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

/**
 * Parse and verify webhook event
 */
export function parseWebhookEvent(body: string, signature: string | string[] | undefined) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }

  if (!signature) {
    throw new Error('Webhook signature is missing')
  }

  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )
}
