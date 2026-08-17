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

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set')
}

/**
 * Stripe server instance - initialized with secret key
 * Use for all server-side operations (payments, subscriptions, etc)
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
  typescript: true,
})

/**
 * Constants for product and price IDs
 *
 * Products:
 * - BUSINESS_PRO: Ploy Pro ($29.99/month) - unlimited reports
 * - CONSULTANT_PRO: Ploy Consultant ($0.00/month) - free tier
 * - AGENCY_PRO: Agency subscription
 * - AI_REPORT: AI Report ($39.00) - one-time charge
 */
export const STRIPE_PRODUCTS = {
  BUSINESS_PRO: process.env.STRIPE_PRODUCT_ID_BUSINESS_PRO || '',
  CONSULTANT_PRO: process.env.STRIPE_PRODUCT_ID_CONSULTANT_PRO || '',
  AGENCY_PRO: process.env.STRIPE_PRODUCT_ID_AGENCY_PRO || '',
} as const

export const STRIPE_PRICES = {
  BUSINESS: {
    MONTHLY: process.env.STRIPE_PRICE_ID_BUSINESS_MONTHLY || '',
  },
  CONSULTANT: {
    MONTHLY: process.env.STRIPE_PRICE_ID_CONSULTANT_MONTHLY || '',
  },
  AGENCY: {
    MONTHLY: process.env.STRIPE_PRICE_ID_AGENCY_MONTHLY || '',
  },
  // One-time charges
  AI_REPORT: process.env.STRIPE_PRICE_ID_AI_REPORT || '', // $39.00
} as const

/**
 * Get the correct price ID based on subscription type and interval
 */
export function getPriceId(
  type: 'business' | 'consultant' | 'agency',
  interval: 'month' | 'year'
): string {
  const key = interval === 'month' ? 'MONTHLY' : 'ANNUAL'
  return STRIPE_PRICES[type.toUpperCase() as keyof typeof STRIPE_PRICES][key]
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
