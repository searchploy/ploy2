/**
 * Stripe Webhook Endpoint
 *
 * Receives webhook events from Stripe and processes them.
 * Configure this URL in Stripe Dashboard → Settings → Webhooks
 */

import { NextRequest, NextResponse } from 'next/server'
import { parseWebhookEvent } from '@/lib/stripe'
import { handleStripeWebhook } from '@/lib/stripe/webhooks'

// Webhook secret is verified in parseWebhookEvent
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    if (!WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify and parse webhook
    let event
    try {
      event = parseWebhookEvent(body, signature)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log(`Processing webhook event: ${event.type}`)

    // Handle the webhook event
    await handleStripeWebhook(event)

    // Return success
    return NextResponse.json(
      { received: true, eventId: event.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Webhook processing error:', error)

    // Always return 200 to prevent Stripe from retrying
    // (but log the error for debugging)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      },
      { status: 200 } // Return 200 even on error to prevent Stripe retry storm
    )
  }
}

// Stripe requires webhook endpoints to respond to HEAD requests
export async function HEAD() {
  return NextResponse.json({ ok: true })
}
